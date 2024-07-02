const express = require('express');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const router = express.Router();

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { roomId, customerName, date, startTime, endTime } = req.body;

        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Check if the room is already booked for the given date and time range
        const existingBookings = await Booking.find({ roomId, date, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
        if (existingBookings.length >= room.capacity) {
            return res.status(400).json({ error: 'Room is fully booked for the selected time range' });
        }

        const booking = new Booking({ roomId, customerName, date, startTime, endTime });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all bookings
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all customers with booked data
router.get('/customers', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        const customersWithBookingData = bookings.map(booking => ({
            customerName: booking.customerName,
            roomName: booking.roomId.number,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime
        }));

        res.status(200).json(customersWithBookingData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get booking count for each customer
router.get('/customer-bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');
        const customerBookingCounts = {};

        bookings.forEach(booking => {
            const customerName = booking.customerName;
            if (!customerBookingCounts[customerName]) {
                customerBookingCounts[customerName] = [];
            }
            customerBookingCounts[customerName].push({
                roomName: booking.roomId.number,
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
                bookingId: booking._id,
                bookingDate: booking.createdAt,
                bookingStatus: booking.bookingStatus
            });
        });

        res.status(200).json(customerBookingCounts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
