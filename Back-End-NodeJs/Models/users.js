const mongoose = require('mongoose')
const Schema = mongoose.Schema;


//create Schema and model
const UsersSchema = new Schema({
    nome: String,
    apelido: String,
    email: String,
    password: String,
});

const User = mongoose.model('users',UsersSchema);

module.exports = User;