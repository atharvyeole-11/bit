const mongoose = require('mongoose');

const relayLogSchema = new mongoose.Schema({
  elderlyUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventType: { type: String, required: true },
  priority: { type: String, enum: ['normal', 'high', 'emergency'], default: 'normal' },
  context: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['pending', 'acknowledged', 'failed', 'escalated'], default: 'pending' },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  escalationLevel: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('RelayLog', relayLogSchema);
