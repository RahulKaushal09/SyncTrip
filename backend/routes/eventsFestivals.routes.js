const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const { LocationWithEventsModel } = require('../models/FestivalsAndEventsModel.js');

const router = express.Router();
const PYTHON_SERVER_IP = process.env.PYTHON_SERVER_IP;
// Helper function to check if the lastUpdatedDate is older than a week
const isDataOlderThanOneWeek = (lastUpdatedDate) => {
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return new Date().getTime() - lastUpdatedDate > oneWeekInMillis;
};
router.get('/getLocationsWithCode', async (req, res) => {
    try {
        // Fetch all locations with their location codes from MongoDB
        console.log("Fetching all locations with codes from MongoDB...");  // Log the action for debugging

        const locations = await LocationWithEventsModel.find({}, { locationName: 1, locationCode: 1, latitude: 1, longitude: 1, closestEventDateTime: 1 });

        if (!locations || locations.length === 0) {
            return res.status(404).json({ message: 'No locations found' });
        }

        return res.status(200).json(locations);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
}
);

// Route to get the events for a location code
router.post('/getEventsForLocation', async (req, res) => {
    var { locationCode, locationName } = req.body;

    // console.log("Location Code:", locationCode);
    // console.log("Location Name:", locationName);
    console.log("Getting events for location code:", locationCode);  // Log the location code for debugging
    console.log("Getting events for location name:", locationName);  // Log the location name for debugging

    try {
        // Fetch the location with its last update date from MongoDB
        if (locationCode != "" && !locationCode) {

            const locationDetails = await LocationWithEventsModel.findOne({ locationCode });

            if (locationDetails) {
                // Check if the last updated date is older than a week
                if (isDataOlderThanOneWeek(locationDetails.lastUpdatedDate)) {
                    // Make a POST request to fetch new data from the external API
                    const LocationNameSearch = locationDetails.locationName.replace(" ", "-").toLowerCase(); // Convert to lowercase and replace spaces with hyphens
                    const response = await axios.post(`${PYTHON_SERVER_IP}/getEventsFromLocationName`, {
                        location: LocationNameSearch  // Sending location name in the payload
                    });

                    // Assuming the response returns an array of events
                    const newEvents = response.data.events;  // Adjust based on actual response structure

                    // Update the location's events (excluding latitude, longitude, locationCode, and locationName)
                    location.events = newEvents.map(event => ({
                        ...event,
                        lastUpdatedDate: Date.now() // Set the last updated date for each event as epoch timestamp
                    }));
                    location.closestEventDateTime = response.data.closestEventDateTime || 0; // Set the closest event date time

                    // Update the lastUpdatedDate for the location as epoch timestamp
                    location.lastUpdatedDate = Date.now();

                    // Save the updated location with the new events
                    await location.save();

                    return res.status(200).json({ message: 'Location events updated successfully', events: location.events });
                }
                else {
                    // return events directly 
                    return res.status(200).json({ message: 'Location events Still Valid', events: location.events });
                }
            }
        }
        else {
            const locationDetails = await LocationWithEventsModel.findOne({ locationName });
            if (locationDetails) {
                return res.status(200).json({ message: 'Location events Still Valid', events: locationDetails.events });
            }
            // If location details are not found in DB, fetch new location and events
            locationName = locationName.trim().replace(" ", "-").toLowerCase(); // Convert to lowercase and replace spaces with hyphens
            // Make a POST request to fetch location details from the external API
            console.log("Fetching new location data for:", locationName);  // Log the location name for debugging

            const locationResponse = await axios.post(`${PYTHON_SERVER_IP}/getEventsFromLocationName`, {
                location: locationName  // Sending location name to fetch details
            });

            // Assuming the locationResponse contains the correct location details
            const locationData = locationResponse.data;  // Modify based on actual response structure
            console.log("Location Data:", locationData);  // Log the location data for debugging 
            // Now create a new LocationWithEventsModel document and add the events

            const newLocation = new LocationWithEventsModel({
                locationName: locationData.locationName,
                locationCode: locationData.locationCode,  // From the response
                latitude: locationData.latitude,  // From the response
                longitude: locationData.longitude,  // From the response
                events: locationData.events.map(event => ({
                    ...event,
                    lastUpdatedDate: Date.now()  // Set the last updated date for each event as epoch timestamp
                })),
                lastUpdatedDate: Date.now(),  // Set the lastUpdatedDate for the location as epoch timestamp
                closestEventDateTime: locationData.closestEventDateTime || 0  // Default to 0 if not provided
            });
            // check if not present already
            if (await LocationWithEventsModel.exists({ locationCode: newLocation.locationCode })) {
                return res.status(400).json({ message: 'Location already exists' });
            }
            // Save the new location with events to the DB
            await newLocation.save();

            return res.status(200).json({ message: 'New location added with events', events: newLocation.events });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
