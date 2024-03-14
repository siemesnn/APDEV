const Reservation = require('../model/reservation');
const {client, DB_NAME } = require('../model/database');



exports.createReservation = async (req, res) => {

    const db = client.db(DB_NAME);
    const reservation = db.collection('reservation');
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
            date,
            time: [],
            duration,
            lab,
            seat,
            reserved_by: req.session.username,
            
        });

        // Save the new user to the database
        await reservation.insertOne(newReservation);

        res.json({ message: "Reserved deservingly!" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};


exports.getReservationByUsername = async (req, res) => {
    try {
      // Check if user is logged in
      if (!req.session || !req.session.username) {
        return res.status(401).json({ message: "Unauthorized access" });
      }
  
      const username = req.session.username;
  
      const db = client.db(DB_NAME);
      const reservation = db.collection('reservation');
      const reservationList = await reservation.find({ username: username }).sort({ id: -1 }).toArray();
  
      if (!reservationList.length) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      res.json(reservationList);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  
exports.getAllReservations = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const reservation = db.collection('reservation');
        const reservationList = await reservation.find().sort({ id: -1 }).toArray();
        res.json(reservationList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};