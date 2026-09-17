const CredibilityScore = require('../models/CredibilityScore');

const getScore = async (req, res) => {
  try {
    const score = await CredibilityScore.findOne({ caregiverId: req.params.caregiverId });
    if (!score) {
      return res.status(404).json({ success: false, error: 'Score not found for this caregiver' });
    }
    res.status(200).json({ success: true, data: score });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { getScore };
