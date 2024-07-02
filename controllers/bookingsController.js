// controllers/bookingsController.js

const Booking = require('../models/Booking');

// Controller functions for bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBooking = async (req, res) => {
    const { roomId, date, user } = req.body;

    try {
        const newBooking = new Booking({ roomId, date, user });
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingById = async (req, res) => {
    const { roomId, date, user } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.roomId = roomId;
        booking.date = date;
        booking.user = user;
        await booking.save();
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        await booking.remove();
        res.json({ message: 'Booking deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
