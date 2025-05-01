const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express application
const app = express();
const server = http.createServer(app);

// Enable CORS for both Express and Socket.IO
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://sos_user:sosuser@cluster-survivor-sync.di2fxkr.mongodb.net/'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  

// Define SOS Schema and Model
const sosSchema = new mongoose.Schema({
  message: String,
  location: {
    lat: Number,
    lon: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SOS = mongoose.model('SOS', sosSchema);

// Real-time Communication (Socket.IO)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for SOS messages
  socket.on('sendSOS', async (data) => {
    console.log('SOS data received:', data);

    // Save SOS to MongoDB
    const newSOS = new SOS({
      message: data.message,
      location: data.location
    });

    try {
      await newSOS.save();
      socket.emit('sosStatus', { status: 'SOS sent successfully!' });
    } catch (err) {
      socket.emit('sosStatus', { status: 'Failed to send SOS!' });
    }
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
