// backend/src/models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'social', 'other']
  },
  imageUrl: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add index for better query performance
eventSchema.index({ creator: 1, date: 1 });
eventSchema.index({ category: 1, date: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;