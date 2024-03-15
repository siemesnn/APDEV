const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatSchema = new Schema({
    availability: {type: String, enum: ['available', 'taken', 'selected']},
    reserved_by: String, //username or userID
    lab: String, //lab name 
  

});

const seat = mongoose.model('seat', seatSchema);

module.exports = seat;