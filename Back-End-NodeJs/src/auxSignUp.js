const express = require('express');
const router = express.Router();
const qSignUp = require('./queries');


router.post('/', qSignUp.signup);


module.exports =  router;   