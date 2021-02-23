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

app.get('/activate',  (req, response) => {
    const User = require('./Models/users')
    const email = req.query.token
    try {
        var myquery = {email: email};
        var newvalue = {$set: {status: "Active"}};
        User.updateOne(myquery, newvalue, function(err, res) {
            if(err) { 
                console.log("Falhou")
            } 
            else 
                response.redirect("http://localhost:3000");
        });
    } catch (err) { console.log(err) }
})

app.use('/purchase', auxBuyTicket)

app.get('/fetch-pdf', (req, res) => {
    res.sendFile(__dirname+'/result.pdf')
})

app.listen(port,() => console.info('Listening on port ' +port))







