const express = require('express');
const router = express.Router();

const petReport = require('./petReport')
const tradingMail = require('./tradingMail')

router.post('/api/report_email', petReport)

router.post('/api/purchase_email', tradingMail)

module.exports = router