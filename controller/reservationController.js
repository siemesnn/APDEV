const Reservation = require('../model/reservation');
const {client, DB_NAME } = require('../model/database');


exports.getUserReservations = async (req, res) => {
  try {
      const db = client.db(DB_NAME);
      //const users = db.collection('users');
      //const user = await users.findOne({ username: req.session.username });
      const reservation =  db.collection('reservation');
      const Reservation = await reservation.find().toArray();
      res.status(200).json(Reservation);
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

exports.createReservation = async (req, res) => {
    try {
        const db = client.db(DB_NAME);
        const reservation = db.collection('reservation');
        const { seatNumber, date, start_time, end_time } = req.body;
        const username = req.session.username;
        const newReservation = {
            date,
            start_time,
            end_time,
            reserved_by: username,
            seatNumber
        };
        await reservation.insertOne(newReservation);
        res.status(201).json({ message: "Reservation successful" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}