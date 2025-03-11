import React, { useState } from 'react';
import '../../styles/HotelSection.css'; // We'll create this CSS file separately
import location from "../../data/locations.json";
import { CiHeart } from "react-icons/ci";
import LocationCard from '../LocationCard/LocationCard';

const PlacesToVisitSection = () => {
    // Sample image URLs (replace with actual hotel images)

    const [activeHotelShow, setActiveHotelShow] = useState(4);


    return (
        <div className="hotels-container" style={{ marginBottom: "50px" }}>
            <h2 className='DescriptionHeading'>Other Places To Visitin in {location[0].title}</h2>
            <div className="hotels-grid">
                {location[0].PlacesToVisit.slice(0, activeHotelShow).map((placesToVisit, index) => (
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