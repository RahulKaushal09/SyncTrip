const express = require('express');
const router = express.Router();
const Location = require('../models/locationModel');
// import mongoose from 'mongoose';
const mongoose = require('mongoose');
// Create Location

router.post('/', async (req, res) => {
    try {
        const location = new Location(req.body);
        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get All Locations
// Get All Locations
router.post('/getAllLocations', async (req, res) => {
    try {
        const limit = parseInt(req.body.limit) || 12;
        const skip = parseInt(req.body.skip) || 0;

        const locations = await Location.find().skip(skip).limit(limit);
        const totalCount = await Location.countDocuments();

        res.json({
            locations,
            totalCount,
            hasMore: skip + limit < totalCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router.get('/', async (req, res) => {
//     try {
//         const limit = parseInt(req.body.limit) || 12;
//         const locations = await Location.find().limit(limit);
//         // const locations = await Location.find();
//         // .populate('hotels')
//         // .populate('placesToVisit');
//         res.json(locations);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

// Get Location by ID
router.get('/:id', async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        res.json(location);
    } catch (error) {
        res.status(404).json({ error: 'Not Found' });
    }
});

// // Update Location
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedLocation);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

// // Delete Location
// router.delete('/:id', async (req, res) => {
//     try {
//         await Location.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Deleted Successfully' });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

module.exports = router;
