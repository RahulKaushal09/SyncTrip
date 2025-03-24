import React from 'react';
import TripSection from '../../components/Trips/TripSection';

const Trips = () => {
    // Sample trip data based on the schema
    const trips = [
        {
            essentials: {
                region: 'Himalchal',
                duration: '2N Shimla • 3N Manali',
                price: 22444,
                pickup: { name: 'Airport' },
                dropPoint: { name: 'Airport' },
                nearbyPoints: { airport: 'Nearby Airport' },
            },
            include: {
                travel: true,
                food: true,
                hotel: true,
            },
            itinerary: 'Visit to Solang Valley, Viceregal Lodge, Mall road, Visit to Scandal Point, Townhall, Shimla Church, Visit to Gaiety Theatre, Kufri Excursion, Hadimba Temple',
        },
        {
            essentials: {
                region: 'Kerala',
                duration: '3N Munnar • 2N Alleppey',
                price: 18999,
                pickup: { name: 'Cochin Airport' },
                dropPoint: { name: 'Cochin Airport' },
                nearbyPoints: { airport: 'Cochin Airport' },
            },
            include: {
                travel: true,
                food: true,
                hotel: true,
            },
            itinerary: 'Visit to Tea Gardens, Mattupetty Dam, Echo Point, Houseboat stay in Alleppey, Backwater cruise, Visit to Kumarakom Bird Sanctuary',
        },
        {
            essentials: {
                region: 'Goa',
                duration: '4N Goa',
                price: 15999,
                pickup: { name: 'Dabolim Airport' },
                dropPoint: { name: 'Dabolim Airport' },
                nearbyPoints: { airport: 'Dabolim Airport' },
            },
            include: {
                travel: true,
                food: true,
                hotel: true,
            },
            itinerary: 'Visit to Baga Beach, Calangute Beach, Dudhsagar Waterfalls, Explore Old Goa Churches, Nightlife at Tito’s Lane',
        },
    ];

    return (
        <div>
            <TripSection trips={trips} />
        </div>
    );
};

export default Trips;