// backend/src/controllers/eventController.js
import Event from '../models/Event.js';
import mongoose from 'mongoose';

// Helper function to handle population
const populateEvent = (query) => {
  return query
    .populate('creator', 'name email')
    .populate('attendees', 'name email');
};

// Get all events with filtering
export const getEvents = async (req, res) => {
  try {
    const { category, startDate, endDate, creator, search } = req.query;
    let query = {};

    // Apply filters
    if (category) {
      query.category = category;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (creator) {
      query.creator = creator;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await populateEvent(
      Event.find(query).sort('-createdAt')
    );

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      message: 'Error fetching events',
      error: error.message 
    });
  }
};

// Get user's events
export const getUserEvents = async (req, res) => {
  try {
    const events = await populateEvent(
      Event.find({ creator: req.user._id }).sort('-createdAt')
    );
    res.json(events);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Error fetching your events' });
  }
};

// Get single event
export const getEventById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await populateEvent(Event.findById(req.params.id));

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Error fetching event' });
  }
};

// Create event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, maxAttendees } = req.body;

    // Validate required fields
    if (!title || !description || !date || !location || !category) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Validate date
    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      return res.status(400).json({ 
        message: 'Event date must be in the future' 
      });
    }

    const imageUrl = req.file ? req.file.path : '';

    const event = new Event({
      title,
      description,
      date: eventDate,
      location,
      category,
      maxAttendees: maxAttendees || null,
      imageUrl,
      creator: req.user._id,
      attendees: [req.user._id]
    });

    await event.save();
    const populatedEvent = await populateEvent(Event.findById(event._id));
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      message: 'Error creating event',
      error: error.message 
    });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    // Validate date if it's being updated
    if (updateData.date) {
      const eventDate = new Date(updateData.date);
      if (eventDate < new Date()) {
        return res.status(400).json({ message: 'Event date must be in the future' });
      }
    }

    const updatedEvent = await populateEvent(
      Event.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      )
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      message: 'Error updating event',
      error: error.message 
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this event' 
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Event deleted successfully',
      eventId: req.params.id
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      message: 'Error deleting event',
      error: error.message 
    });
  }
};

// Join event
export const joinEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.some(id => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Already attending this event' });
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot join past events' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    const updatedEvent = await populateEvent(Event.findById(event._id));
    res.json(updatedEvent);
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ 
      message: 'Error joining event',
      error: error.message 
    });
  }
};

// Leave event
export const leaveEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.attendees.some(id => id.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Not attending this event' });
    }

    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot leave past events' });
    }

    event.attendees = event.attendees.filter(
      id => id.toString() !== req.user._id.toString()
    );
    
    await event.save();
    const updatedEvent = await populateEvent(Event.findById(event._id));
    res.json(updatedEvent);
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ 
      message: 'Error leaving event',
      error: error.message 
    });
  }
};