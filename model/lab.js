const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seatSchema = new Schema({
    seatNumber: Number,
    reservations: [{ type: Schema.Types.ObjectId, ref: 'Reservation' }] // Reference to Reservation model
});

const labSchema = Schema({
    name: String,
    seats: [seatSchema],
    capacity: Number
});

const Lab = mongoose.model('Lab', labSchema);

module.exports = Lab;
