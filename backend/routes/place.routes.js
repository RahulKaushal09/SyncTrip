const express = require('express');
const Place = require('../models/placesToVisitModel');
const router = express.Router();

// GET all places
router.get('/', async (req, res) => {
    try {
        const places = await Place.find();
        res.json(places);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
// POST a new place
router.post('/getLimitedPlacesByLocationId', async (req, res) => {

    const { locationId, limit } = req.body;
    try {
        console.log({ locationId, limit });
        const placesToVisit = await Place.find({ location: locationId }).limit(limit);
        res.json(placesToVisit);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST a new place
router.post('/', async (req, res) => {
    const { name, link, description, rating, highlights, image } = req.body;
    const newPlace = new Place({
        name,
        link,
        description,
        rating,
        highlights,
        image
    });

    try {
        const savedPlace = await newPlace.save();
        res.json(savedPlace);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
