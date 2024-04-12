const Lab = require('../model/lab');
const {client, DB_NAME } = require('../model/database');
const Reservation = require('../model/reservation');
const userController = require('./userController');


exports.reserveASeat = async (req, res) => {
    const db = client.db(DB_NAME);
    const labs = db.collection('labs');
    try {
        const { seatNumber, date, start_time, end_time, anonymous } = req.body;
        const labName = req.params.labId;
        const username = req.session.username;
        console.log("anonymous lab controller:", anonymous);

        // Find the lab document by its name
        const lab = await labs.findOne({ name: labName });

        if (!lab) {
            return res.status(404).json({ message: "Lab not found", labName });
        }

        // Find the seat within the lab's seats array based on the provided seatNumber
        const seat = lab.seats.find(seat => seat.seatNumber === seatNumber);

        if (!seat) {
            return res.status(404).json({ message: "Seat not found" });
        }

        // Check if the seat is available for reservation
        const overlappingReservation = seat.reservations.find(reservation =>
            reservation.date === date &&
            ((start_time >= reservation.start_time && start_time < reservation.end_time) ||
             (end_time > reservation.start_time && end_time <= reservation.end_time))
        );

        if (overlappingReservation) {
            return res.status(409).json({ message: "Seat is already reserved for the specified time slot" });
        }

        // Create a new reservation object
        const newReservation = {
            date,
            start_time,
            end_time,
            lab_id: lab._id, // Use lab's _id for lab_id field
            anonymous: anonymous,
            reserved_by: username,
            seatNumber
        };

        // Add the new reservation to the reservations array of the seat
        seat.reservations.push(newReservation);

        // Update the lab document
        await labs.updateOne({ _id: lab._id }, { $set: { seats: lab.seats } });


        // ReservationController
        const reservation = db.collection('reservation');
        const newReservationUser = {
            date,
            start_time,
            end_time,
            lab_id: labName, // Use lab's _id for lab_id field
            anonymous: anonymous,
            reserved_by: username,
            seatNumber
        };


        await reservation.insertOne(newReservationUser);


        return res.status(201).json({ message: "Reservation successful" });
    } catch (e) {
        console.error("Error occurred while reserving seat:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.retrieveSeatPerTime = async (req, res) => {
    const db = client.db(DB_NAME);
    const labs = db.collection('labs');
    try {
        const { date, start_time, end_time } = req.body;
        const labName = req.params.labId;

        // Find the lab document by its name
        const lab = await labs.findOne({ name: labName });

        if (!lab) {
            return res.status(404).json({ message: "Lab not found", labName });
        }

        const seatsWithReservations = new Set();
        
        // Find all seats that are reserved during the specified time slot
        lab.seats.forEach(seat => {
            seat.reservations.forEach(reservation => {
                if (reservation.date === date &&
                    ((start_time >= reservation.start_time && start_time < reservation.end_time) ||
                    (end_time > reservation.start_time && end_time <= reservation.end_time))) {
                        seatsWithReservations.add(seat.seatNumber);
                    }
            });
        });

        const allSeats = Array.from({ length: lab.capacity }, (_, index) => index + 1);
        const reservedSeats = Array.from(seatsWithReservations);

        const seats = allSeats.map(seatNumber => ({
            seatNumber,
            reserved: reservedSeats.includes(seatNumber)
        }));

        return res.status(200).json({ seats });
    } catch (e) {
        console.error("Error occurred while retrieving reserved seats:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}




