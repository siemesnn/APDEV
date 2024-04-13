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


// Define the route for deleting reservations
exports.deleteReservation = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const reservation = db.collection('reservation');
        const lab = db.collection('labs');
        
        // Extract parameters from the request body
        const { lab_id, seatNumber, date, start_time, end_time, username } = req.body;

        console.log("Request Body:", req.body.reserved_by);

        // Query to find and delete the reservation
        const query = {
            date: date,
            start_time: start_time,
            end_time: end_time,
            lab_id: lab_id,
            reserved_by: req.body.reserved_by,
            seatNumber: parseInt(seatNumber)
        }

        console.log("Query:", query);

        // Delete the reservation from the database
        const result = await reservation.deleteOne(query);

        console.log("Delete Result:", result);

        if (result.deletedCount === 0) {
            console.log("Reservation not found or you are not authorized to delete it");
            return res.status(404).json({ message: "Reservation not found or you are not authorized to delete it" });
        }

        console.log("Reservation deleted successfully");

        return res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error occurred while deleting reservation:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// Helper function to retrieve 
const retrieveReservation = async (labId, seatNumber, date, startTime, endTime, reservedBy, db) => {
    try {
        console.log("Retrieving reservation...");
        const reservationCollection = db.collection('reservation');

        // Construct the query based on the provided parameters
        const query = {
            "lab_id": labId,
            "seatNumber": seatNumber,
            "date": date,
            "start_time": startTime,
            "end_time": endTime,
            "reserved_by": reservedBy
        };

        console.log("Query:", query);

        // Execute the query to find the reservation
        const reservation = await reservationCollection.findOne(query);
        console.log("Retrieved reservation:", reservation);
        return reservation;
    } catch (error) {
        console.error('Error occurred while retrieving reservation:', error);
        throw error;
    }
};


function formatTime(hour) {
    // Ensure the hour is within the range of 0 to 23
    hour = Math.max(0, Math.min(23, hour));

    // Convert the hour to a string and pad with leading zero if necessary
    const hourStr = hour < 10 ? '0' + hour : String(hour);

    // Return the formatted time string
    return hourStr + ':00';
}



exports.updateReservationProfile = async (req, res) => {
    try {
        console.log("Update reservation profile request received...");

        // Extract data from the request body
        let { newDate, newStart, newEndTime, labId, seatNumber, date, start_time, end_time, reserved_by } = req.body;
        console.log("New Date:", newDate);
        console.log("New Start Time:", newStart);
        console.log("New End Time:", newEndTime);
        console.log("Lab ID:", labId);
        console.log("Seat Number:", seatNumber);
        console.log("Date:", date);
        console.log("Start Time:", start_time);
        console.log("End Time:", end_time);
        console.log("Reserved By:", reserved_by);


        

        // Add your logic here to update the reservation
        const db = client.db(DB_NAME);
        const reservationCollection = db.collection('reservation');
        const labCollection = db.collection('labs');

        // Construct the query based on the provided parameters
        const reservationQuery = {
            "lab_id": labId,
            "seatNumber": seatNumber,
            "date": date,
            "start_time": start_time,
            "end_time": end_time,
            "reserved_by": reserved_by
        };

        console.log("Query:", reservationQuery);

        // Retrieve the existing reservation
        const existingReservation = await reservationCollection.findOne(reservationQuery);

        // Check if the reservation exists
        if (!existingReservation) {
            console.log("Reservation not found");
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Update the reservation with the new date and time
        existingReservation.date = newDate;
        existingReservation.start_time = newStart;
        existingReservation.end_time = newEndTime;

        // Update the reservation in the reservation collection
        await reservationCollection.updateOne(reservationQuery, { $set: existingReservation });


        // Retrieve lab based from labname
        const lab = await labCollection.findOne({ name: labId});

        console.log("Lab:", lab);

        // Find the seat within the lab's seats array based on the provided seatNumber
        const seat = lab.seats.find(seat => seat.seatNumber === seatNumber);
        console.log("Seat:", seat);

        // Find the index of the reservation in the seat's reservations array
        const reservationIndex = seat.reservations.findIndex(reservation =>
            reservation.date === date &&
            reservation.start_time === start_time &&
            reservation.end_time === end_time &&
            reservation.reserved_by === reserved_by
        );
        console.log("Reservation Index:", reservationIndex);


        

        // Update the reservation in the seat's reservations array
        seat.reservations[reservationIndex].date = newDate;
        seat.reservations[reservationIndex].start_time = newStart;
        seat.reservations[reservationIndex].end_time = newEndTime;

        // Update the lab document
        await labCollection.updateOne({ name: labId }, { $set: { seats: lab.seats } });


        // Send a response indicating success
        res.status(200).json({ message: 'Reservation updated successfully' });
    } catch (error) {
        console.error('Error occurred while updating reservation:', error);
        res.status(500).json({ message: 'An error occurred while updating reservation. Please try again later.' });
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
        await db.collection('labs').deleteMany({ reserved_by: username });

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

        console.log("Request Body:", req.body);

        // Find the lab document by its name
        const lab = await labs.findOne({ name: lab_name });

        if (!lab) {
            console.log("Lab not found:", lab_name);
            return res.status(404).json({ message: "Lab not found", lab_name });
        }

        console.log("Lab found:", lab);
        console.log(parseInt(seatNumber))

        // Find the seat object corresponding to the provided seat number
        const seat = lab.seats.find(seat => seat.seatNumber === parseInt(seatNumber));

        if (!seat) {
            console.log("Seat not found:", seatNumber);
            return res.status(404).json({ message: "Seat not found", seatNumber });
        }

        console.log("Seat found:", seat);

        // Find the reservation to delete
        const reservationIndex = seat.reservations.findIndex(reservation =>
            reservation.date === date &&
            reservation.start_time === start_time &&
            reservation.end_time === end_time &&
            reservation.reserved_by === username
        );

        if (reservationIndex === -1) {
            console.log("Reservation not found");
            return res.status(404).json({ message: "Reservation not found" });
        }

        console.log("Reservation found:", seat.reservations[reservationIndex]);

        // Remove the reservation from the seat
        seat.reservations.splice(reservationIndex, 1);

        // Update the lab document in the database
        await labs.updateOne({ name: lab_name }, { $set: { seats: lab.seats } });

        console.log("Reservation deleted successfully");

        return res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (e) {
        console.error("Error occurred while deleting reservation:", e);
        return res.status(500).json({ message: "Internal server error" });
    }
}

