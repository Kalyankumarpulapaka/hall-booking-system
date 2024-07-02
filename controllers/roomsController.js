// controllers/roomsController.js

const Room = require('../models/Room');

// Controller functions for rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRoom = async (req, res) => {
    const { number, capacity } = req.body;

    try {
        const newRoom = new Room({ number, capacity });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRoomById = async (req, res) => {
    const { number, capacity } = req.body;

    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.number = number;
        room.capacity = capacity;
        await room.save();
        res.json(room);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        await room.remove();
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
