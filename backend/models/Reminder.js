const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'medication', 'appointment'
  datetime: { type: Date, required: true },
  recurrence: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  status: { type: String, enum: ['pending', 'completed', 'missed'], default: 'pending' },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
