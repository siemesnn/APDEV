const mongoose = require('mongoose'); // Assuming you're using Mongoose
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    
    reservationID: Number,
    date: Date,
    time: String,
    end_time: String,
    duration: Number,
    lab: String,
    seat: String,
    res_name: String,
    status: {type: String, required: true, enum: ['completed', 'pending']},
  });
  
const Reservation = mongoose.model('Reservation', userSchema);

module.exports = Reservation;
