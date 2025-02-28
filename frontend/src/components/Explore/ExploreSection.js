import React, { useState } from 'react';
import LocationCard from '../LocationCard/LocationCard';
import locations from "../../data/locations.json"
const ExploreSection = () => {
    const [visibleCount, setVisibleCount] = useState(15); // Start with 12 cards visible
    // Function to handle "Show More" click
    console.log(locations);

    const handleShowMore = () => {
        setVisibleCount(locations.length); // Show all locations
    };
    return (
        <section>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    // margin: "0px 40px",
                    flexWrap: "wrap"
                }}
            >
                {locations.slice(0, visibleCount).map((location, index) => (

                    < LocationCard
                        key={index}
                        name={location.title?.replace(/[0-9. ]/g, '') || 'Unknown'} // Safely handle null/undefined title
                        rating={location.rating || 'N/A'} // Safely handle null/undefined rating
                        places={location.objective.split('Tourist attractions')[0].split(" ").slice(-4)[0] || '0'} // Safely extract places
                        bestTime={location.best_time || 'N/A'} // Safely handle null/undefined best_time
                        images={location.images || ['https://via.placeholder.com/300x200?text=No+Image']} // Pass the images array or fallback
                    />
                ))
                }
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
};
export default ExploreSection;