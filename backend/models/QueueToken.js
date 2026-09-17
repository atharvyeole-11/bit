const mongoose = require('mongoose');

const queueTokenSchema = new mongoose.Schema({
  serviceId: { type: String, required: true }, // e.g., 'doctor_consult', 'support_call'
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tokenNumber: { type: Number, required: true },
  status: { type: String, enum: ['waiting', 'serving', 'completed', 'cancelled'], default: 'waiting' },
  estimatedWaitTime: { type: Number, default: 0 } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('QueueToken', queueTokenSchema);
