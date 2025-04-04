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
//get placesTovist by objectId
router.get('/:id', async (req, res) => {
    try {

        const place = await Place.findById(req.params.id);
        res.json(place);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
router.post('/getPlacesByIds', async (req, res) => {
    const { placeIds } = req.body;  // Expect an array of placeIds
    try {
        // console.log({ placeIds });
        const placesToVisit = await Place.find({ _id: { $in: placeIds } }); // Fetch all matching places
        res.json(placesToVisit);
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
        console.log("placesToVisit", placesToVisit);

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
