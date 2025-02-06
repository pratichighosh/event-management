// backend/src/routes/events.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Get file extension
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filter by creator if userId is provided
    if (req.query.userId) {
      query.creator = req.query.userId;
    }

    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by date range
    if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) };
    }
    if (req.query.endDate) {
      query.date = { ...query.date, $lte: new Date(req.query.endDate) };
    }

    const events = await Event.find(query)
      .populate('creator', 'name email')
      .populate('attendees', 'name email')
      .sort('-createdAt');

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('attendees', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
});

// Create event
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, location, category, maxAttendees } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Validate date
    if (new Date(date) < new Date()) {
      return res.status(400).json({ 
        message: 'Event date must be in the future' 
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      maxAttendees: maxAttendees || null,
      imageUrl: req.file ? req.file.path : '',
      creator: req.user._id,
      attendees: [req.user._id]
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('creator', 'name email')
      .populate('attendees', 'name email');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// Update event
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update fields
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('creator', 'name email')
    .populate('attendees', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// Delete event
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: 'Event deleted successfully',
      eventId: req.params.id
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Join event
router.post('/:id/join', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already joined
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('creator', 'name email')
      .populate('attendees', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ message: 'Error joining event' });
  }
});

// Leave event
router.post('/:id/leave', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.user._id.toString()
    );

    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('creator', 'name email')
      .populate('attendees', 'name email');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ message: 'Error leaving event' });
  }
});

export default router;