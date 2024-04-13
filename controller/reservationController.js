const Reservation = require('../model/reservation');
const {client, DB_NAME } = require('../model/database');


exports.getUserReservations = async (req, res) => {
  try {
    const db = client.db(DB_NAME);
    const labs = db.collection('labs');

    // Find all labs
    const allLabs = await labs.find().toArray();

    // Collect reservations from all labs
    const reservationList = allLabs.reduce((acc, lab) => {
        lab.seats.forEach(seat => {
            acc.push(...seat.reservations);
        });
        return acc;
    }, []);

    res.json(reservationList);
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
        const labs = db.collection('labs');

        // Find all labs
        const allLabs = await labs.find().toArray();

        // Collect reservations from all labs
        const reservationList = allLabs.reduce((acc, lab) => {
            lab.seats.forEach(seat => {
                acc.push(...seat.reservations);
            });
            return acc;
        }, []);

        res.json(reservationList);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

exports.updateReservation = async (req, res) => {
  try {
      const { date, username, start_time, end_time } = req.body;

      // Find the reservation that matches the provided criteria
      const reservation = await Reservation.findOne({
          date: date,
          reserved_by: username,
          start_time: start_time,
          end_time: end_time
      });

      if (!reservation) {
          return res.status(404).json({ message: 'Reservation not found' });
      }

      // Update the date and time if they are provided in the request body
      if (req.body.newDate) {
          reservation.date = req.body.newDate;
      }
      if (req.body.newStartTime) {
          reservation.start_time = req.body.newStartTime;
      }
      if (req.body.newEndTime) {
          reservation.end_time = req.body.newEndTime;
      }

      // Save the updated reservation
      await reservation.save();

      res.status(200).json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};