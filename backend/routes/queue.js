const express = require('express');
const { joinQueue, getQueueStatus } = require('../controllers/queueController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.use(protect());

router.post('/join', activityLogger('join_queue'), joinQueue);
router.get('/:serviceId/status', getQueueStatus);

module.exports = router;
