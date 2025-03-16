require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Location = require('./models/locationModel');
const Hotel = require('./models/hotelModel');
const PlacesToVisit = require('./models/placesToVisitModel');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const filePath = "D:/DOITBUNNYY/SyncTrip/frontend/src/data/locations.json";
const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const importData = async () => {
    try {
        await Location.deleteMany();
        await Hotel.deleteMany();
        await PlacesToVisit.deleteMany();

        for (const data of jsonData) {
            const location = new Location({
                best_time: data.best_time || null,
                description: data.description || '',
                href: data.href || '',
                objective: data.objective || '',
                rating: data.rating || 0,
                title: data.title || '',
                PlaceImageLink: data.PlaceImageLink || '',
                PlacesToVisitLink: data.PlacesToVisitLink || '',
                HotelsLink: data.HotelsLink || '',
                placesNumberToVisit: data.placesNumberToVisit || 0,
                fullDetails: data.fullDetials || '',
                photos: data.photos || [],
                images: data.images || []
            });

            await location.save();

            const hotelIds = [];
            if (data.hotels && Array.isArray(data.hotels)) {
                for (const hotelData of data.hotels) {
                    const hotel = new Hotel({
                        hotel_name: hotelData.hotel_name || '',
                        hotel_link: hotelData.hotel_link || '',
                        hotel_description: hotelData.hotel_description || '',
                        hotel_images: hotelData.hotel_images || [],
                        hotel_location: hotelData.hotel_location || '',
                        price: hotelData.price || 0,
                        location: location._id
                    });
                    const savedHotel = await hotel.save();
                    hotelIds.push(savedHotel._id);
                }
            }

            const placeIds = [];
            if (data.PlacesToVisit && Array.isArray(data.PlacesToVisit)) {
                for (const placeData of data.PlacesToVisit) {
                    const place = new PlacesToVisit({
                        title: placeData.title || '',
                        link: placeData.link || '',
                        rating: placeData.rating || 0,
                        description: placeData.description || '',
                        highlights: placeData.highlights || '', // Fixed to default to empty string
                        image: placeData.image || '',
                        location: location._id
                    });
                    const savedPlace = await place.save();
                    placeIds.push(savedPlace._id);
                }
            }

            location.hotels = hotelIds.length ? hotelIds : [];
            location.placesToVisit = placeIds.length ? placeIds : [];
            await location.save();
        }

        console.log('Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();