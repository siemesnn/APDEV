const mongoose = require('mongoose'); // Assuming you're using Mongoose
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    
    date: Date,
    time: String,
    end_time: String,
    duration: Number,
    lab: String,
    seat: String,
    reserved_by: {
      type: Schema.Types.ObjectId,
      ref: 'User' // This should match the model name of your user schema
  },

  });
  
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
