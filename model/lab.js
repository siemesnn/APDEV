const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labSchema = Schema({
    name: String,
    capacity: Number,
    seats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Seat'
        }
    ]

});

const lab = mongoose.model('lab', labSchema);

module.exports = lab;


// laboratory.seats.get(0)

// [pag pinindot ko to] [] [] []
// laborotary.setas.get(0).userAssignedTo = req.session.username
