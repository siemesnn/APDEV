const Lab = require('../model/lab');
const {client, DB_NAME } = require('../model/database');
const Reservation = require('../model/reservation');


exports.reserveASeat = async (req, res) => {
    const db = client.db(DB_NAME);
    const reservationCollection = db.collection('reservation');
    try {
        const lab = req.params.labId;
        const { dates, start_time, end_time, anonymous, selected_seat } = req.body;
        const isAnonymous = req.body['anon-checkbox'] === 'anonymous';


        const newReservation = new Reservation({
            date: dates,
            time: start_time,
            end_time: end_time,
            lab: lab,
            anonymous: isAnonymous,
            reserved_by: req.session.username,
            selected_seat: selected_seat
        });

        await reservationCollection.insertOne(newReservation);

        res.json({ newReservation }); // Include multiple fields // Only include newReservation
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};



