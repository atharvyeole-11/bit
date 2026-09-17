const express = require('express');
const { getActivityLogs } = require('../controllers/activityLogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Caregivers or Guardians might view these logs
router.get('/:userId', protect(['admin', 'caregiver', 'guardian']), getActivityLogs);

module.exports = router;
