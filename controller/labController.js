const Lab = require('../model/lab');
const {client, DB_NAME } = require('../model/database');
const Reservation = require('../model/reservation');
const userController = require('./userController');


exports.reserveASeat = async (req, res) => {
    const db = client.db(DB_NAME);
    const labs = db.collection('labs');
    try {
        const { seatNumber, date, start_time, end_time } = req.body;
        const labName = req.params.labId;
        const username = req.session.username;

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

// Define the route for deleting reservations
exports.deleteReservation = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const reservation = db.collection('reservation');
        
        // Extract parameters from the request body
        const { lab_id, seatNumber, date, start_time, end_time, username } = req.body;

        // Query to find and delete the reservation
        const query = {
            date: date,
            start_time: start_time,
            end_time: end_time,
            lab_id: lab_id,
            reserved_by: username,
            seatNumber: parseInt(seatNumber)
        }
            

        // Delete the reservation from the database
        const result = await reservation.deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Reservation not found or you are not authorized to delete it" });
        }

        return res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error occurred while deleting reservation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



exports.editReservation = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const reservation = db.collection('reservation');
        
        // Extract parameters from the request body
        const { lab_id, seatNumber, date, start_time, end_time, new_date, new_start_time, new_end_time, username } = req.body;

        // Check if a reservation already exists with the given parameters
        const existingReservation = await reservation.findOne({
            lab_id: lab_id,
            seatNumber: seatNumber,
            date: date,
            start_time: start_time,
            end_time: end_time
        });

        if (!existingReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Check if the new slot is available
        const slotAvailable = await reservation.findOne({
            lab_id: lab_id,
            date: new_date,
            seatNumber: seatNumber,
            $or: [
                {
                    $and: [
                        { start_time: { $lt: new_end_time } },
                        { end_time: { $gt: new_start_time } }
                    ]
                },
                {
                    $and: [
                        { start_time: { $gte: new_start_time } },
                        { end_time: { $lte: new_end_time } }
                    ]
                },
                {
                    $and: [
                        { start_time: { $lte: new_start_time } },
                        { end_time: { $gte: new_end_time } }
                    ]
                }
            ],
            _id: { $ne: existingReservation._id } // Exclude the current reservation
        });

        if (slotAvailable) {
            return res.status(400).json({ message: "New slot is already reserved" });
        }

        // Update the reservation in the database
        const result = await reservation.updateOne(
            { _id: existingReservation._id }, // Update the existing reservation
            {
                $set: {
                    date: new_date,
                    start_time: new_start_time,
                    end_time: new_end_time
                }
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        return res.status(200).json({ message: "Reservation updated successfully" });
    } catch (error) {
        console.error("Error occurred while editing reservation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




    exports.deleteAllReservationsBasedOnUser = async (req, res) => {
    try {
        // Connect to the MongoDB database
        const db = client.db(DB_NAME);
        
        // Get the username from the session
        const username = req.session.username;

        // Delete all reservations associated with the session username
        await db.collection('reservation').deleteMany({ reserved_by: username });

        // Respond with success message
        return res.status(200).json({ message: 'All reservations deleted successfully' });
    } catch (error) {
        console.error('Error occurred while deleting reservations:', error);
        // Respond with an error message
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteReservationFromLab = async (req, res) => {
    const db = client.db(DB_NAME);
    const labs = db.collection('labs');
    try {
        const { lab_name, seatNumber, date, start_time, end_time, username } = req.body;

        // Find the lab document by its name
        const lab = await labs.findOne({ name: lab_name });

        if (!lab) {
            return res.status(404).json({ message: "Lab not found", lab_name });
        }

        // Find the seat object corresponding to the provided seat number
        const seat = lab.seats.find(seat => seat.seatNumber === seatNumber);

        if (!seat) {
            return res.status(404).json({ message: "Seat not found", seatNumber });
        }

        // Find the reservation to delete
        const reservationIndex = seat.reservations.findIndex(reservation =>
            reservation.date === date &&
            reservation.start_time === start_time &&
            reservation.end_time === end_time &&
            reservation.reserved_by === username
        );

        if (reservationIndex === -1) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Remove the reservation from the seat
        seat.reservations.splice(reservationIndex, 1);

        // Update the lab document in the database
        await labs.updateOne({ name: lab_name }, { $set: { seats: lab.seats } });

        return res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (e) {
        console.error("Error occurred while deleting reservation:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}
