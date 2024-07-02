require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;  // Get port from environment variable or default to 3000
const dbURI = process.env.MONGODB_URI;  // Get MongoDB URI from environment variable

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
});

// Routes
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');

// Use the routes defined in external files
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
