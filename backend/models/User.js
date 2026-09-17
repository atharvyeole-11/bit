const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['elderlyUser', 'guardian', 'caregiver', 'admin'], default: 'elderlyUser' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // For basic auth
  linkedGuardians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  linkedCaregivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  languagePreference: { type: String, default: 'en' },
  accessibilityMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
