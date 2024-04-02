const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labSchema = Schema({
    id: String,
    seats: [
        {
            seatNumber: 1,
            userAssignedTo: null
        },
        {
            seatNumber: 2,
            userAssignedTo: null
        },
        {
            seatNumber: 3,
            userAssignedTo: null
        },
        {
            seatNumber: 4,
            userAssignedTo: null
        },
        {
            seatNumber: 5,
            userAssignedTo: null
        },
        {
            seatNumber: 6,
            userAssignedTo: null
        },
        {
            seatNumber: 7,
            userAssignedTo: null
        },
        {
            seatNumber: 8,
            userAssignedTo: null
        },
        {
            seatNumber: 9,
            userAssignedTo: null
        },
        {
            seatNumber: 10,
            userAssignedTo: null
        },
        {
            seatNumber: 11,
            userAssignedTo: null
        },
        {
            seatNumber: 12,
            userAssignedTo: null
        },
        {
            seatNumber: 13,
            userAssignedTo: null
        },
        {
            seatNumber: 14,
            userAssignedTo: null
        },
        {
            seatNumber: 15,
            userAssignedTo: null
        },
        {
            seatNumber: 16,
            userAssignedTo: null
        },
        {
            seatNumber: 17,
            userAssignedTo: null
        },
        {
            seatNumber: 18,
            userAssignedTo: null
        }
    ],

    capacity: 18,
    

});

const lab = mongoose.model('lab', labSchema);

module.exports = lab;


// laboratory.seats.get(0)

// [pag pinindot ko to] [] [] []
// laborotary.setas.get(0).userAssignedTo = req.session.username
