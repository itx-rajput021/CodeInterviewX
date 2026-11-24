require("dotenv").config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173', 'http://localhost:4173'], methods: ['GET', 'POST'] }
});

// Middlewares
app.use(express.json({ limit: '1mb' }));
app.use(cors());
app.use(helmet());

// Test Route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Routes
app.use('/api', userRoutes);
app.use('/api', interviewRoutes);

io.on('connection', (socket) => {
    socket.on('room:join', ({ roomCode, name, role }) => {
        socket.join(roomCode);
        socket.to(roomCode).emit('room:joined', { name, role });
    });
    socket.on('code:change', ({ roomCode, code, language }) => {
        socket.to(roomCode).emit('code:change', { code, language });
    });
    socket.on('chat:send', ({ roomCode, message, name }) => {
        io.to(roomCode).emit('chat:new', { message, name, sentAt: new Date().toISOString() });
    });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});