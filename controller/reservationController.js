const Reservation = require('../model/reservation');
const {client, DB_NAME } = require('../model/database');



const reservationSchema = new Schema({
    reservationID: Number,
    date: Date,
    time: String,
    duration: Number,
    lab: String,
    seat: String,
    reserved_by: String,
    status: {type: String, required: true, enum: ['completed', 'pending']},
  });




// CHANGE TO CREATING RESERVATIONS
exports.createReservation = async (req, res) => {

    const db = client.db(DB_NAME);
    const users = db.collection('reservation');
    try {
        const {date, time, seat, } = req.body;

        // Check if the username already exists using Mongoose
        const existingReservation = await reservation.findOne({ date, time, seat });

        if (existingUser) {
            res.status(400).json({ message: "This seat has been reserved already!" });
            return;
        }

        // Hash the password before storing it in the database

        // Create a new user document using the Mongoose model
        const newReservation = new Reservation({
            reservationID,
            date,
            time: [],
            password,
            role,
            description : '',
            profilePicture: 'https://www.redditstatic.com/avatars/avatar_default_02_4856A3.png',
            reservations : [],
        });

        // Save the new user to the database
        await users.insertOne(newUser);

        res.json({ message: "Registration successful" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

