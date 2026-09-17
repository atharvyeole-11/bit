const mongoose = require('mongoose');

const guardianSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  elderlyUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactPriority: { type: Number, required: true, default: 1 },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  relationship: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Guardian', guardianSchema);
