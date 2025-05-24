const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Initialize express app
const app = express();
const server = http.createServer(app);

// Load environment variables
dotenv.config();
const environment = process.env.NODE_ENV || 'production';
console.log({ environment });

// Database configuration
const dbUrl = process.env.MONGO_URI;

// CORS allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://www.synctrip.in',
    'https://synctrip.in',
    'https://synctrip.in/',
];
// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Socket.IO events
io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Join a chat room
    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`➡️ Socket ${socket.id} joined chat: ${chatId}`);
    });

    // Handle typing event
    socket.on('typing', (chatId) => {
        socket.to(chatId).emit('typing', chatId);
        console.log(`✍️ Typing event emitted for chat: ${chatId}`);
    });

    // Handle stop typing event
    socket.on('stop_typing', (chatId) => {
        socket.to(chatId).emit('stop_typing', chatId);
        console.log(`🛑 Stop typing event emitted for chat: ${chatId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});
// -----------------> Middleware <-----------------------------------//
// CORS configuration
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);
app.use((req, res, next) => {



    if (req.is('application/json')) {

        express.json({ limit: '30mb' })(req, res, next); // Removed extended:true
    } else {
        next();
    }
});

// URL-encoded form parser (extended option valid here)
app.use(express.urlencoded({ limit: '30mb', extended: true }));
// Logging middleware (development only)
if (environment === 'development') {
    app.use(morgan('combined'));
    console.log('Morgan is enabled...');
}

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// // -----------------> Socket.IO Setup <-----------------------------------//
// const io = new Server(server, {
//     cors: {
//         origin: allowedOrigins,
//         methods: ['GET', 'POST'],
//         credentials: true,
//     },
// });

// Attach io to req for controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Socket.IO events
// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     // Join a chat room
//     socket.on('join_chat', (chatId) => {
//         socket.join(chatId);
//         console.log(`User ${socket.id} joined chat ${chatId}`);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// -----------------> Routes <-----------------------------------//
// Request timestamp logging for /api/locations (kept as is)
// app.use('/api/locations', (req, res, next) => {
//     req.requestStartTime = Date.now();
//     console.log(`➡️ Request started at: ${new Date(req.requestStartTime).toISOString()}`);
//     next();
// });

// Route imports
const locationRoutes = require('./routes/location.routes');
const hotelRoutes = require('./routes/hotel.routes');
const placeRoutes = require('./routes/place.routes');
const fetchingRoutes = require('./routes/fetching.routes');
const userRoutes = require('./routes/user.routes');
const tripRoutes = require('./routes/trips.routes');
const eventsLocationRoutes = require('./routes/eventsFestivals.routes');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chats.routes');
const messageRoutes = require('./routes/message.routes');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Route setup
app.use('/api/locations', locationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/fetching/', fetchingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/events', eventsLocationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// -----------------> API Endpoints <-----------------------------------//
// Root route for deployment check
app.get('/', (req, res) => {
    res.send('App is running');
});

// // External API route for events
// app.get('/api/events', async (req, res) => {
//   const url = 'https://api.allevents.in/events/search/?query=comedy%20show%20in%20Chandigarh';

//   try {
//     const response = await axios.post(
//       url,
//       {},
//       {
//         headers: {
//           'Cache-Control': 'no-cache',
//           'Ocp-Apim-Subscription-Key': '9tdsvscW9qrA4W5',
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     res.json(response.data);
//   } catch (err) {
//     console.error('Failed to fetch events:', err.message);
//     res.status(500).json({ error: 'Failed to fetch data' });
//   }
// });

// -----------------> MongoDB Connection <-----------------------------------//
mongoose
    .connect(dbUrl)
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas');

        // Start server
        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            console.log(`🚀 Server running in ${environment} mode on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// -----------------> Legacy Code (Commented-Out) <-----------------------------------//
/*
// Old app.listen with MongoDB connection
app.listen(port, () => {
    console.log(`Application running in ${environment} environment, listening to port ${port}....`);
    try {
        mongoose.connect(dbUrl, {})
            .then(() => console.log('Connected to MongoDB Atlas'))
            .catch(err => console.error('MongoDB connection error:', err));
    } catch (error) {
        console.error('unable to connect, please check your connection....' + error)
    }
});

// Old CORS middleware
app.use(function (req, res, next) {
    const origin = req.get('referer');
    const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
    if (isWhitelisted) {
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
        res.header("Access-Control-Expose-Headers", "x-auth-token");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    }
    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
});
*/