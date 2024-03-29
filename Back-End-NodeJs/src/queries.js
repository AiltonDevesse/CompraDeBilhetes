
const express = require('express')
const Stripe = require('stripe');
const pdf = require('html-pdf');
const User = require('../Models/users')
const Ticket = require('../Models/ticket');
var QRCode = require('qrcode');
const pdfTemplate = require('../documents');

require('dotenv').config({path: `${__dirname}/.env`});

let stripeSecretKey = process.env.KEY

exports.login = async (req,res) => {
    try {
	    var email = req.body.email;
        var password = req.body.password; 

        User.findOne({email:email,password:password}).then(function(result){
                if(result != null) { 
                    if(result.status == "Active")    
                        res.json(result.email);
                    else
                        res.status(401).json({message: "Your account isn't active yet\nPlease check your email"})
                } 
                else {
                    res.status(401).json({message: "E-mail/Password is wrong"})
                }
            });
    } catch (error) {res.status(500).send({error})}
}

exports.signup = async (req,res) => {
    try {
        var email = req.body.email; 
        
        const data = req.body;
        const newUser = new User(data)
            
        User.findOne({email:email}).then(function(result){
                if(result != null) { 
                    res.status(401).json({message: "E-mail already in use"});
                } 
                else{
                    newUser.save((error) => {
                        if(error) { 
                            res.status(401).json({message: "Sorry, internal server errors"})  
                        } 
                        else {
                            res.status(200).json({
                                confirm:'Account created'
                            });
                        }
                    });
                }
            })
    } catch (error) {res.status(500).json({error})}
}

exports.ticket = async (req,res) => {
    try {
        const data = { 
            email: req.body.email,
            from: req.body.from,
            to: req.body.to,
            depart_Date: req.body.depart,
            return_Date: req.body.return,
            time: req.body.time,
            trip: req.body.trip,
            paymentId: req.body.id, 
            amount: req.body.amount,
            duration: req.body.duration 
        }
        
        const a = await Ticket.find({to:data.from,from:data.to,return_Date:data.depart,time:data.time}).countDocuments()
        const b = await Ticket.find({from:data.from,to:data.to,depart_Date:data.depart,time:data.time}).countDocuments()

        const newTicket = new Ticket(data)

        if((a + b) < 25 ) {

            const amount = data.amount
            const stripe = new Stripe(stripeSecretKey);

            try{
                await stripe.paymentIntents.create({
                    amount,
                    currency: 'USD',
                    description: 'DTransport Ticket',
                    payment_method: data.paymentId,
                    confirm: true
                });

                //QR code
                data.amount /=100
                var temp =[];
                var ticketQr = `DTransport Ticket\n\n`+
                                `From: ${data.from}\nTo: ${data.to}\nDepart: ${data.depart_Date}\n`+
                                `Return: ${data.return_Date}\nTime: ${data.time}\nTrip: ${data.trip}\n`
                temp.push(ticketQr);
                
                newTicket.save((error) => {
                    if(error) { 
                        res.status(401).json({message: "Sorry, internal server errors"})  
                    } 
                    else {
                        QRCode.toDataURL(temp,{errorCorrectionLevel:'H'},function (e, url) {
                            data.url = url;
                            
                            pdf.create(pdfTemplate(data), {}).toFile('result.pdf', (err) => {
                                if(err) {
                                    res.send(Promise.reject());
                                }
                                res.status(200).json({
                                    confirm: "Your ticket QR code is downloading"
                                });
                            });
                        });
                    }
                });
            }catch(error){
                return res.status(400).json({message: error.message})
            }
        } 
        else {
            res.status(401).json({message: "No ticket available for this route"})
        }
    }catch (error) {
        res.status(500).json({error})}
}


