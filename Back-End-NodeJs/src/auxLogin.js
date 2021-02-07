const express = require('express');
const router = express.Router();
const qLogin = require('./queries');


router.post('/', qLogin.login);


module.exports =  router;   