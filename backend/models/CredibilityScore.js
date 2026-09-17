const mongoose = require('mongoose');

const credibilityScoreSchema = new mongoose.Schema({
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  score: { type: Number, required: true, default: 100 }, // 0 to 100 percentage
  lastCalculated: { type: Date, default: Date.now },
  totalTasksCompleted: { type: Number, default: 0 },
  averageResponseTime: { type: Number, default: 0 } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('CredibilityScore', credibilityScoreSchema);
