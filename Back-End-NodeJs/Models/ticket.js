const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//create Schema and model
const TicketSchema = new Schema({
    email: String,
    from: String,
    to: String,
    depart_Date: String,
    return_Date: String,
    time: String,
    trip: String,
    paymentId: String,
    amount: 0
});

const Ticket = mongoose.model('tickets',TicketSchema);

module.exports = Ticket;