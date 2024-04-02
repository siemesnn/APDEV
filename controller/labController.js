const Lab = require('../model/lab');
const {client, DB_NAME } = require('../model/database');
const Reservation = require('../model/reservation');


exports.reserveASeat = async (req, res) => {
    try {
        const { seatNumber } = req.body; // This is one of the buttons ung seat 
        // Get from the url parameter
        const { lab_id } = req.params; // eto ung lab id so ex. reservation/a where a is the labid 
        const username = req.session.username; // Get the username from the session
        const user = await lab_id.findOne({ seatNumber: seatNumber }); // So pag nahanap
        if (user.userAssignedTo === null) {
            await lab_id.updateOne({ seatNumber: seatNumber }, { $set: { userAssignedTo: username } });
            res.status(201).json({ message: "Seat reserved" });
        } else {
            res.status(400).json({ message: "Seat already reserved" });
        }
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}




