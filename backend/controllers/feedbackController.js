const Feedback = require('../models/Feedback');
const CredibilityScore = require('../models/CredibilityScore');
const { triggerRelay } = require('../services/guardianRelay');

const recalculateCredibilityScore = async (caregiverId) => {
  const feedbacks = await Feedback.find({ caregiverId });
  if (feedbacks.length === 0) return;

  const totalRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
  const avgRating = totalRating / feedbacks.length;
  
  // Basic weighted formula: 20 points per star (1-5) -> 20-100%
  let newScore = avgRating * 20;

  // Additional factors could be added here (e.g., response time)
  
  let credScore = await CredibilityScore.findOne({ caregiverId });
  if (!credScore) {
    credScore = new CredibilityScore({ caregiverId });
  }
  credScore.score = Math.min(100, Math.max(0, newScore));
  credScore.lastCalculated = new Date();
  credScore.totalTasksCompleted = feedbacks.length; // Simplified proxy for tasks completed
  await credScore.save();

  // Threshold check
  if (credScore.score < 60) {
    console.log(`[CredibilityWatcher] Caregiver ${caregiverId} score dropped below 60%. Triggering relay.`);
    await triggerRelay({
      elderlyUserId: caregiverId, // Sending alert regarding caregiver
      eventType: 'low_credibility',
      priority: 'high',
      context: { score: credScore.score }
    });
  }
};

const createFeedback = async (req, res) => {
  try {
    const { caregiverId, rating, comment } = req.body;
    const feedback = await Feedback.create({
      caregiverId,
      userId: req.user.id,
      rating,
      comment
    });

    // Run recalculation asynchronously
    recalculateCredibilityScore(caregiverId).catch(err => console.error('Score recalculation failed', err));

    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

module.exports = { createFeedback };
