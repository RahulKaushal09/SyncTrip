
const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};
const truncateText = (text, maxLength = 150) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

export const tripListSchema = (trips = []) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Join Pre-Planned Trips",
    description: "Explore and join curated group travel adventures across destinations.",
    itemListElement: trips.map((trip, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
            "@type": "TouristTrip",
            name: trip.title || `Trip ${index + 1}`,
            description: trip.description || `Looking for a group trip to ${trip.title}? Join SyncTrip’s pre-planned travel experience. Discover top destinations, make new friends, and travel stress-free.`,
            url: `https://synctrip.in/trips/${trip.slug || trip._id || index}`,
            itinerary: truncateText(stripHtml(trip.itinerary || '')) || "",
            location: {
                "@type": "Place",
                name: trip.title || "Unknown Destination"
            },
            image: trip.MainImageUrl || "https://via.placeholder.com/300x200?text=Trip+Image",
            offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: trip.essentials.price || "0",
                availability: trip.essentials.availableSeats,
                url: `https://synctrip.in/trips/${trip.slug || trip._id || index}`
            }
        }
    }))
});
export const locationDataSchema = (locationData) => ({
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: locationData?.title || 'Destination',
    description: locationData?.description || 'Explore this destination with SyncTrip, plan your trip, and discover top attractions.',
    address: {
        '@type': 'PostalAddress',
        addressCountry: locationData?.country || 'India',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: locationData?.fullDetails?.coordinates?.lat || 0,
        longitude: locationData?.fullDetails?.coordinates?.long || 0,
    },
    image: locationData?.images?.[0] || 'https://via.placeholder.com/300x200?text=Destination+Image',
    aggregateRating: locationData?.rating
        ? {
            '@type': 'AggregateRating',
            ratingValue: locationData.rating,
            reviewCount: locationData.reviews || 1,
        }
        : undefined,
    url: `https://synctrip.in/location/${locationData?._id || ''}`,
});


export const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SyncTrip",
    url: "https://synctrip.in",
    description: "Plan, explore, and join trips with travelers near you using SyncTrip.",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://synctrip.in/search?query={search_term_string}",
        "query-input": "required name=search_term_string"
    }
};

export const locationSchema = (locations = []) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Travel Destinations",
    description: "Discover the best destinations to explore with SyncTrip.",
    itemListElement: locations.map((loc, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: loc.title || `Destination ${index + 1}`,
        url: `https://synctrip.in/location/${loc.slug || loc._id || index}`
    }))
});


export const tripDataSchema = (tripData, locationData) => ({
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tripData?.title || 'Group Trip',
    description:
        truncateText(stripHtml(tripData?.itinerary), 300)
        ||
        `Join this group trip to ${locationData?.title || 'a destination'} with SyncTrip. Enjoy a pre-planned adventure, meet new travelers, and explore top attractions.`,
    url: `https://synctrip.in/trips/${tripData?._id || ''}`,
    image: locationData?.images?.[0] || 'https://via.placeholder.com/300x200?text=Trip+Image',
    destination: {
        '@type': 'Place',
        name: locationData?.title || 'Destination',
        address: {
            '@type': 'PostalAddress',
            addressCountry: locationData?.country || 'India',
        },
    },
    offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: tripData?.essentials?.price || '0',
        availability: tripData?.essentials?.availableSeats || 'InStock',
        url: `https://synctrip.in/trips/${tripData?._id || ''}`,
    },
    startDate: tripData?.essentials?.timelines?.[0]?.fromDate || '',
    endDate: tripData?.essentials?.timelines?.[0]?.tillDate || '',
});