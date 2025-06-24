const express = require('express');
const { getCurrentRate } = require('../controllers/rateController');

const router = express.Router();

router.get('/current', getCurrentRate);

module.exports = router;

