import React, { useEffect, useState } from 'react';
import '../../styles/HotelSection.css'; // We'll create this CSS file separately
// import location from "../../data/locations.json";
import { CiHeart } from "react-icons/ci";
import LocationCard from '../LocationCard/LocationCard';

const PlacesToVisitSection = ({ title, placesIds }) => {
    // Sample image URLs (replace with actual hotel images)

    const [activeHotelShow, setActiveHotelShow] = useState(4);
    const [places, setPlaces] = useState([]); // State to store fetched places
    useEffect(() => {
        const fetchPlaces = async () => {
            if (!placesIds || placesIds.length === 0) return; // Avoid making a request if no placesIds are available

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/places/getPlacesByIds`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ placeIds: placesIds }), // Send array of ObjectIds
                });
                if (!response.ok) throw new Error('Failed to fetch places');
                const data = await response.json();
                console.log("Places data:", data); // Log the fetched places for debugging

                setPlaces(data); // Store the fetched places in state
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchPlaces();
    }, [placesIds]); // Re-run when placesIds change



    return (
        <div className="hotels-container" style={{ marginBottom: "50px" }}>
            <h2 className='DescriptionHeading'><strong>Other Places To Visit  in {title?.replace(/[0-9. ]/g, '')}</strong></h2>
            <div className="hotels-grid">
                {places.slice(0, activeHotelShow).map((placesToVisit, index) => (
                    <LocationCard name={placesToVisit.title} rating={placesToVisit.rating} images={placesToVisit.image} />
                )
                    // <HotelCard key={index} imageUrl={image} />
                )}

            </div>
            <button
                className='view-more-btn mt-5'
                onClick={() => setActiveHotelShow(10)}
            >
                Show More

            </button>
        </div>
    );
};

export default PlacesToVisitSection;