const express = require('express');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const router = express.Router();

// Create a new room
router.post('/', async (req, res) => {
    try {
        const { number, capacity, amenities, pricePerHour } = req.body;
        const room = new Room({ number, capacity, amenities, pricePerHour });
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all rooms with booking data
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find().lean();
        const bookings = await Booking.find().populate('roomId').lean();

        const roomsWithBookingData = rooms.map(room => {
            const roomBookings = bookings.filter(booking => booking.roomId._id.toString() === room._id.toString());
            return {
                ...room,
                bookings: roomBookings.map(booking => ({
                    customerName: booking.customerName,
                    date: booking.date,
                    startTime: booking.startTime,
                    endTime: booking.endTime
                })),
                bookedStatus: roomBookings.length > 0
            };
        });

        res.status(200).json(roomsWithBookingData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
