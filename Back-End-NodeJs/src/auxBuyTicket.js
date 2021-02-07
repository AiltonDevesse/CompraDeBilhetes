const express = require('express');
const router = express.Router();
const qBuyTicket = require('./queries');

router.post('/', qBuyTicket.ticket);

module.exports =  router;   