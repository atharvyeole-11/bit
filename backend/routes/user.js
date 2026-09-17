const express = require('express');
const { getLanguages, updateLanguage, updateAccessibility } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { activityLogger } = require('../middleware/activityLogger');

const router = express.Router();

router.get('/languages', getLanguages);
router.put('/language', protect(), activityLogger('update_language'), updateLanguage);
router.put('/accessibility', protect(), activityLogger('update_accessibility'), updateAccessibility);

module.exports = router;
