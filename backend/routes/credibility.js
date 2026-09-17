const express = require('express');
const { getScore } = require('../controllers/credibilityController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:caregiverId', protect(), getScore);

module.exports = router;
