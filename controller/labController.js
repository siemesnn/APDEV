const Lab = require('../model/lab');
const {client, DB_NAME } = require('../model/database');
const Reservation = require('../model/reservation');


exports.reserveASeat = async (req, res) => {
    const db = client.db(DB_NAME);
    const reservationCollection = db.collection('reservation');
    try {
        const lab = req.params.labId;
        const { dates, start_time, end_time, anonymous } = req.body;
    

        const newReservation = new Reservation({
            date: dates,
            time: "9:30",
            end_time: "10:00",
            lab: lab,
            anonymous: anonymous,
            reserved_by: req.session.username,
        });

        await reservationCollection.insertOne(newReservation);

        res.json({ newReservation }); // Include multiple fields // Only include newReservation
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};



