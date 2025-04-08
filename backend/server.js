const express = require('express');
const mongoose = require('mongoose');
var mongo = require('mongodb').MongoClient;

const dotenv = require('dotenv');
var cors = require('cors')
const morgan = require('morgan');
const axios = require('axios');
const path = require('path');
// Initialize express app
const app = express();
const allowedOrigins = ['http://localhost:3000',
    'https://www.synctrip.in',
    'https://synctrip.in',
    'https://synctrip.in/',];

dotenv.config();


// set env
const environment = process.env.NODE_ENV || "development";
console.log({ environment });

const dbUrl = process.env.MONGO_URI;

// Whitelisdty
const whitelist = [
    '*',
];

app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allows cookies and authentication headers
}));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const bodyParser = require('body-parser');

// some basic header for auth
// app.use(function (req, res, next) {
//     const origin = req.get('referer');
//     const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
//     if (isWhitelisted) {
//         // res.header("Access-Control-Allow-Origin", "*");
//         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
//         res.header("Access-Control-Expose-Headers", "x-auth-token");
//         res.setHeader('Access-Control-Allow-Credentials', true);
//         next();
//     }
//     if (req.method === 'OPTIONS') res.sendStatus(200);
//     else next();
// });

// -----------------> Routes <-----------------------------------//
// Import routes
const locationRoutes = require('./routes/location.routes');
const hotelRoutes = require('./routes/hotel.routes');
const placeRoutes = require('./routes/place.routes');
const fetchingRoutes = require('./routes/fetching.routes');
const userRoutes = require('./routes/user.routes');
const tripRoutes = require('./routes/trips.routes');
const eventsLocationRoutes = require('./routes/eventsFestivals.routes');
const authRoutes = require('./routes/auth.routes');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// -----------------> Routes Setup <---------------------------------//
app.use('/api/locations', (req, res, next) => {
    req.requestStartTime = Date.now(); // save the timestamp on request object
    console.log(`➡️ Request started at: ${new Date(req.requestStartTime).toISOString()}`);
    next(); // proceed to next middleware/route
});
app.use('/api/locations', locationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/fetching/', fetchingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/events', eventsLocationRoutes);
app.use('/api/auth', authRoutes);



app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));


// --------------------------> Checking for Deployment purposes <----------------------- // 
app.get('/', (req, res) => {
    res.send('App is running');
});
app.get('/api/events', async (req, res) => {
    const url = 'https://api.allevents.in/events/search/?query=comedy%20show%20in%20Chandigarh';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache',
                'Ocp-Apim-Subscription-Key': '9tdsvscW9qrA4W5',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


if (environment === 'development') {
    app.use(morgan('combined'));
    // ------------------------> Logger (Morgan) <---------------------------- //
    console.log('Morgan is enabled...');
}

const port = process.env.PORT || 5000;

// app.listen(port, () => {
//     console.log(`Application running in ${environment} environment, listening to port ${port}....`);
//     try {
//         mongoose.connect(dbUrl, {

//         })
//             .then(() => console.log('Connected to MongoDB Atlas'))
//             .catch(err => console.error('MongoDB connection error:', err));
//     } catch (error) {
//         console.error('unable to connect, please check your connection....' + error)
//     }
// });
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB Atlas');

    // Start Express app only after DB connection is successful
    app.listen(port, () => {
        console.log(`🚀 Server running in ${environment} mode on port ${port}`);
    });
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit the app if unable to connect
});
