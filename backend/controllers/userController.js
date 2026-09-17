const User = require('../models/User');

const getLanguages = (req, res) => {
  // Stub for supported languages
  res.status(200).json({
    success: true,
    data: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'hi', name: 'Hindi' }
    ]
  });
};

const updateLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { languagePreference: language }, { new: true });
    res.status(200).json({ success: true, data: user.languagePreference });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateAccessibility = async (req, res) => {
  try {
    const { accessibilityMode } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { accessibilityMode }, { new: true });
    res.status(200).json({ success: true, data: user.accessibilityMode });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { getLanguages, updateLanguage, updateAccessibility };
