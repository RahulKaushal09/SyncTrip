const express = require('express');
const Location = require('../models/locationModel');
const router = express.Router();

// GET all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET a single location by ID
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        res.json(location);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST a new location
router.post('/', async (req, res) => {
    const { name, best_time, description, rating, photos, placesNumberToVisit, full_details, top_places_to_visit, hotels, places_to_visit } = req.body;
    const newLocation = new Location({
        name,
        best_time,
        description,
        rating,
        photos,
        placesNumberToVisit,
        full_details,
        top_places_to_visit,
        hotels,
        places_to_visit
    });

    try {
        const savedLocation = await newLocation.save();
        res.json(savedLocation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
