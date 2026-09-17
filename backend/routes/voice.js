const express = require('express');
const { transcribeIntent } = require('../controllers/voiceController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.post('/transcribe', protect(), activityLogger('voice_command'), transcribeIntent);

module.exports = router;
