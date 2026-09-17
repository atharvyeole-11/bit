const express = require('express');
const { getEntries, createEntry, deleteEntry } = require('../controllers/knowledgeBaseController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.route('/')
  .get(protect(), getEntries)
  .post(protect(['admin', 'caregiver']), activityLogger('create_kb_entry'), createEntry);

router.route('/:id')
  .delete(protect(), activityLogger('delete_kb_entry'), deleteEntry);

module.exports = router;
