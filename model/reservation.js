const mongoose = require('mongoose'); // Assuming you're using Mongoose
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    
    date: String,
    time: String,
    end_time: String,
    duration: Number,
    lab: String,
    anonymous: String,
    reserved_by: String, // This should match the model name of your user schema
  });
  
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
