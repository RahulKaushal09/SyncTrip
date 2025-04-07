const mongoose = require('mongoose');
const axios = require('axios');
// import location from '../models/locationModel.js';
const Location = require('../models/locationModel.js'); // Adjust the path as necessary

const GOOGLE_API_KEY = 'AIzaSyBcYLw5aFg6Uq81_TsEurc3LIDXGlArQho'; // replace with your key
const MONGODB_URI = "mongodb+srv://synctripofficial:adminSyncTrip@synctripdb.4qm1d.mongodb.net/?retryWrites=true&w=majority&appName=syncTripDB"; // change this too
console.log({ MONGODB_URI });

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ Connected to MongoDB");
        updateAllLocations();
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));

async function updateAllLocations() {
    try {
        const locations = await Location.find({});
        for (const location of locations) {
            // Remove numbers and periods from title
            location.title = location.title.replace(/[0-9. ]/g, '');

            // Replace spaces with hyphens
            location.title = location.title.replace(/ /g, "-");

            const titleLower = location.title.toLowerCase();
            console.log(`Processing location: ${location.title}`);
            // Check if it's "Parveti Valley" or "Auli"
            // if (titleLower.includes("parvati-valley")) {
            //     location.fullDetails = location.fullDetails || {};
            //     location.fullDetails.coordinates = {
            //         lat: 31.992181,  // Replace with actual lat of Parveti Valley
            //         long: 77.484201  // // Replace with actual long of Parveti Valley
            //     };
            //     await location.save();
            //     console.log(`✅ Manually updated Parveti Valley with lat: ${location.fullDetails.coordinates.lat}, long: ${location.fullDetails.coordinates.long}`);
            //     continue;
            // }

            // if (titleLower.includes("auli")) {
            //     location.fullDetails = location.fullDetails || {};
            //     location.fullDetails.coordinates = {
            //         lat: 30.530518,  // Replace with actual lat of Auli
            //         long: 79.568459  // Replace with actual long of Auli
            //     };
            //     await location.save();
            //     console.log(`✅ Manually updated Auli with lat: ${location.fullDetails.coordinates.lat}, long: ${location.fullDetails.coordinates.long}`);
            //     continue;
            // }

            // Skip if already has coordinates
            // if (
            //     location.fullDetails &&
            //     location.fullDetails.coordinates &&
            //     location.fullDetails.coordinates.lat &&
            //     location.fullDetails.coordinates.long
            // ) {
            //     console.log(`✅ ${location.title} already has coordinates: lat: ${location.fullDetails.coordinates.lat}, long: ${location.fullDetails.coordinates.long}`);
            //     continue;
            // }
            if (titleLower.includes("kasauli")) {
                const query = encodeURIComponent(location.title.replace(/-/g, " ")); // Revert hyphens for API query
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${GOOGLE_API_KEY}`;

                try {
                    const response = await axios.get(url);
                    const data = response.data;

                    if (data.status === "OK" && data.results.length > 0) {
                        const { lat, lng } = data.results[0].geometry.location;

                        location.fullDetails.coordinates.lat = lat;
                        location.fullDetails.coordinates.long = lng;

                        await location.save();
                        console.log(`✅ Updated ${location.title} with lat: ${lat}, long: ${lng}`);
                    } else {
                        console.warn(`⚠️ No result for: ${location.title}`);
                    }
                } catch (apiError) {
                    console.error(`❌ Error fetching coordinates for ${location.title}:`, apiError.message);
                }
            }
        }
    } catch (err) {
        console.error("❌ Error updating locations:", err);
    } finally {
        mongoose.disconnect();
    }
}
