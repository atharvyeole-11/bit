const express = require('express');
const { createFeedback } = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.post('/', protect(), activityLogger('submit_feedback'), createFeedback);

module.exports = router;
