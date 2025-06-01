
export const metaTags = {
    home: {
        title: "SyncTrip | Explore, Create, and Join Trips",
        description: "Discover trips near you, connect with fellow travelers, or plan your own adventure with SyncTrip – your social trip planner.",
        keywords: "travel, group trip, create trip, trip planner, join trip, travel app, destination, itinerary, events, hotels, nearby trips"
    },
    trips: {
        title: "Join Group Trips Near You | Pre-Planned Travel Adventures – SyncTrip",
        description: "Browse pre-planned group trips happening near you. Join exciting travel experiences, connect with travelers, and explore destinations with SyncTrip.",
        keywords: "join group trip, pre-planned trips, travel groups, weekend getaways, travel buddies, synctrip, adventure trips, local trips, trip planner, explore destinations"
    },
    location: (locationData) => ({
        title: `Explore ${locationData?.title || 'Destination'} – Plan Your Trip with SyncTrip`,
        description: `Discover ${locationData?.title || 'this destination'} with SyncTrip! Plan your trip, explore top attractions, find hotels, and join group adventures in ${locationData?.country || 'India'}.`,
        keywords: `${locationData?.title || 'destination'}, travel ${locationData?.title || 'destination'}, ${locationData?.title || 'destination'} attractions, group trips, trip planner, SyncTrip, ${locationData?.country || 'India'} travel`,
        ogImage: locationData?.images?.[0] || 'https://via.placeholder.com/1200x630?text=SyncTrip+Destination',
    }),
    tripDetails: (tripData, locationData) => ({
        title: `${tripData?.title || 'Group Trip'} – Join with SyncTrip in ${locationData?.title || 'Destination'}`,
        description: `Join ${tripData?.title || 'this group trip'} with SyncTrip! Explore ${locationData?.title || 'top destinations'}, meet fellow travelers, and enjoy a pre-planned adventure starting at ₹${tripData?.essentials?.price || '0'}.`,
        keywords: `${tripData?.title || 'group trip'}, group trip ${locationData?.title || 'destination'}, ${locationData?.title || 'destination'} travel, join trip, SyncTrip, adventure travel, ${locationData?.country || 'India'} trips`,
        ogImage: locationData?.images?.[0] || 'https://via.placeholder.com/1200x630?text=SyncTrip+Trip',
    }),
};