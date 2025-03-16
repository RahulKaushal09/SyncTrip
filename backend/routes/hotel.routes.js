const express = require('express');
const router = express.Router();
const Hotel = require('../models/hotelModel');

// CRUD operations for Hotel
// router.post('/', async (req, res) => {
//     try {
//         const hotel = new Hotel(req.body);
//         await hotel.save();
//         res.status(201).json(hotel);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

router.post('/getHotelsByIds', async (req, res) => {
    try {
        // const limit = parseInt(req.body.limit) || 4;
        const hotelIds = req.body.hotelIds;
        const hotels = await Hotel.find({ _id: { $in: hotelIds } });

        // const hotels = await Hotel.find().limit(limit);

        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error });
    }
});
router.get('/', async (req, res) => {
    try {

        const hotels = await Hotel.find().populate('booking_info');
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ error });
    }
});

// router.put('/:id', async (req, res) => {
//     try {
//         const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedHotel);
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         await Hotel.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Deleted Successfully' });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });

module.exports = router;
