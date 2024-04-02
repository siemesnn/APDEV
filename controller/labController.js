const Lab = require('../model/lab');
const {client, DB_NAME } = require('../model/database');
const Reservation = require('../model/reservation');

exports.reserveASeat = async (req, res) => {
    try {
        const { seatNumber, date, start_time, end_time } = req.body
        const lab_id = req.params.labId // Kuwa sa url
        const username = req.session.username;

        const lab = await Lab.findOne({ lab_id }).lean().exec();

        if (!lab) {
            return res.status(404).json({ message: "Lab not found" });
        }

        const seat = lab.seats.find(seat => seat.seatNumber === seatNumber);

        if (!seat) {
            return res.status(404).json({ message: "Seat not found" });
        }

        if (seat.reservations.length === 0) {
            const newReservation = new Reservation({
                date,
                start_time,
                end_time,
                lab_id,
                reserved_by: username,
                seatNumber
            });
            seat.reservations.push({ reservation: newReservation });
            await Lab.findByIdAndUpdate(lab._id, lab); // Update the lab
            return res.status(201).json({ message: "Reservation successful" });
        } else {
            return res.status(409).json({ message: "Seat is already reserved" });
        }
    } catch (e) {
        console.error("Error occurred while reserving seat:", e);
        return res.status(500).json({ message: "Internal server error", lab_id, date, start_time, end_time, reserved_by, seatNumber });
    }
}






