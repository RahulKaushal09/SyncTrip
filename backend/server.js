const express = require('express');
const mongoose = require('mongoose');
var mongo = require('mongodb').MongoClient;

const dotenv = require('dotenv');
var cors = require('cors')
const morgan = require('morgan');

// Initialize express app
const app = express();
const allowedOrigins = ['https://www.synctrip.in'];

dotenv.config();


// set env
const environment = process.env.NODE_ENV || "development";
console.log({ environment });

const dbUrl = process.env.MONGO_URI;

// Whitelisdty
const whitelist = [
    '*'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allows cookies and authentication headers
}));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const bodyParser = require('body-parser');

// some basic header for auth
app.use(function (req, res, next) {
    const origin = req.get('referer');
    const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
    if (isWhitelisted) {
        res.header("Access-Control-Allow-Origin", "https://www.synctrip.in");
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
        res.header("Access-Control-Expose-Headers", "x-auth-token");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    }
    if (req.method === 'OPTIONS') res.sendStatus(200);
    else next();
});

// -----------------> Routes <-----------------------------------//
// Import routes
const locationRoutes = require('./routes/location.routes');
const hotelRoutes = require('./routes/hotel.routes');
const placeRoutes = require('./routes/place.routes');
const fetchingRoutes = require('./routes/fetching.routes');

// -----------------> Routes Setup <---------------------------------//
app.use('/api/locations', locationRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/fetching/', fetchingRoutes);


app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));


// --------------------------> Checking for Deployment purposes <----------------------- // 
app.get('/', (req, res) => {
    res.send('App is running');
});


if (environment === 'development') {
    app.use(morgan('combined'));
    // ------------------------> Logger (Morgan) <---------------------------- //
    console.log('Morgan is enabled...');
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Application running in ${environment} environment, listening to port ${port}....`);
    try {
        mongoose.connect(dbUrl, {

        })
            .then(() => console.log('Connected to MongoDB Atlas'))
            .catch(err => console.error('MongoDB connection error:', err));
    } catch (error) {
        console.error('unable to connect, please check your connection....' + error)
    }
});

