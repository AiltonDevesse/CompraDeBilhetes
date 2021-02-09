const port = 3001
const express = require('express')
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const query = require('./src/queries');
const auxLogin = require('./src/auxLogin');
const auxSignUp = require('./src/auxSignUp');
const auxBuyTicket = require('./src/auxBuyTicket');
var cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.json({limit: '1mb'}));

mongoose.connect('mongodb://localhost/DTransport',{ useNewUrlParser: true }, { useUnifiedTopology: true })

mongoose.connection
    .once('open', function (){console.log("Successfully connected to MongoDB")})
    .on('error',function(error){console.log(error);});

app.use(cors());

app.use('/loginQuery',auxLogin)

app.use('/SignUpQuery',auxSignUp)

app.use('/purchase', auxBuyTicket)

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(__dirname+'/result.pdf')
})

app.listen(port,() => console.info('Listening on port ' +port))







