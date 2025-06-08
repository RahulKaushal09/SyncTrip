import React, { useEffect, useState } from 'react';
import '../../styles/HotelSection.css'; // We'll create this CSS file separately
import '../../styles/PlacesToVisitSection.css'; // We'll create this CSS file separately
// import location from "../../data/locations.json";
import { CiHeart } from "react-icons/ci";
import LocationCard from '../LocationCard/LocationCard';

const PlacesToVisitSection = ({ title, placesIds }) => {
    // Sample image URLs (replace with actual hotel images)
    const [activeHotelShow, setActiveHotelShow] = useState(6);
    const [previousShowMore, setPreviousShowMore] = useState(6); // State to track the number of hotels shown
    const [places, setPlaces] = useState([]); // State to store fetched places
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // State to track if the screen is mobile
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

                setPlaces(data); // Store the fetched places in state
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchPlaces();
    }, [placesIds]); // Re-run when placesIds change



    return (
        <div className="hotels-container" style={{ marginBottom: "50px" }}>
            <h2 className='DescriptionHeading'><strong>Other Places To Visit  in {title?.replace(/[0-9.]/g, '')}</strong></h2>
            <div className="placesToVisitGrid">
                {places.slice(0, activeHotelShow).map((placesToVisit, index) => (
                    <LocationCard name={placesToVisit.title} rating={placesToVisit.rating} images={placesToVisit.image} inlineStyle={{ width: isMobile ? "100%" : "260px" }} imageInlineStyle={{ width: isMobile ? "100%" : "260px" }} key={placesToVisit.title} />
                )
                    // <HotelCard key={index} imageUrl={image} />
                )}

            </div>
            {previousShowMore < places.length && (
                <button
                    className='view-more-btn mt-5'
                    onClick={() => {
                        setActiveHotelShow(prev => prev + 6);
                        setPreviousShowMore(activeHotelShow + 6);
                        if (previousShowMore >= places.length) {
                            setActiveHotelShow(places.length);
                            setPreviousShowMore(places.length);
                        }

                    }}
                >
                    Show More

                </button>
            )
            }
        </div >
    );
};

export default PlacesToVisitSection;