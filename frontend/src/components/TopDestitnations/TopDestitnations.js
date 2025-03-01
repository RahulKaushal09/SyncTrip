import React, { useState } from 'react';
import '../../styles/TopDestinations.css'
import LocationCard from '../LocationCard/LocationCard';
import locations from "../../data/locations.json"


const TopDestitnations = () => {
    const [visibleCount, setVisibleCount] = useState(10); // St
    const handleShowMore = () => {
        setVisibleCount(locations.length); // Show all locations
    };
    return (

        <section className="">
            {/* Section title */}
            <h2 className="fw-bold majorHeadings" style={{ textAlign: "left" }}>Top Destinations</h2>
            {/* Row of cards */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    // margin: "0px 40px",
                    flexWrap: "wrap"
                }}
            >
                {locations.slice(0, visibleCount).map((location, index) => (
                    <LocationCard
                        key={index}
                        name={location.title?.replace(/[0-9. ]/g, '') || 'Unknown'} // Safely handle null/undefined title
                        rating={location.rating || 'N/A'} // Safely handle null/undefined rating
                        places={location.placesNumberToVisit || "0"} // Safely extract places
                        bestTime={location.best_time || 'N/A'} // Safely handle null/undefined best_time
                        images={location.images || ['https://via.placeholder.com/300x200?text=No+Image']} // Pass the images array or fallback
                    />
                ))}

            </div>
            {
                visibleCount < locations.length && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <button className="btn btn-black" onClick={handleShowMore}>
                            Show More
                        </button>
                    </div>
                )
            }
        </section>
    )
}
export default TopDestitnations;