const express = require('express');
const { triggerEmergency } = require('../controllers/emergencyController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.post('/trigger', protect(), activityLogger('trigger_emergency'), triggerEmergency);

module.exports = router;
