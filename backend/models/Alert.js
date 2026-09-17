const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'fall', 'missed_medication'
  triggeredAt: { type: Date, default: Date.now },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  acknowledgedAt: { type: Date },
  status: { type: String, enum: ['active', 'acknowledged', 'resolved'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
