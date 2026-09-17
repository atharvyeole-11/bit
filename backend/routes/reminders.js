const express = require('express');
const { getReminders, createReminder, updateReminder, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.use(protect());

router.route('/')
  .get(getReminders)
  .post(activityLogger('create_reminder'), createReminder);

router.route('/:id')
  .put(activityLogger('update_reminder'), updateReminder)
  .delete(activityLogger('delete_reminder'), deleteReminder);

module.exports = router;
