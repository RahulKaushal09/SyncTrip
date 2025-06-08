import React from 'react';
import '../../styles/preItinerary/card.css'; // Custom CSS for styling

const ItineraryCard = ({ name = 'Unknown',
    imgSrc = 'https://via.placeholder.com/200x300?text=No+Image',
    days = 'N/A', }) => { // Destructure props
    return (
        <div className="itinerary-card" key={name}>
            <img
                src={imgSrc || 'https://via.placeholder.com/200x300?text=No+Image'} // Fallback image if imgSrc is missing
                alt={`${name} Itinerary`}
                className="card-image-itinerary"
            />
            <div className="card-overlay">
                <h3 className="card-title">{name}</h3>
                <p className="card-text">{days}</p> {/* Use days as passed, no hard-coded "Days" */}
            </div>
        </div>
    );
};

// Optional: Add default props for safety
// ItineraryCard.defaultProps = {
//     name: 'Unknown',
//     imgSrc: 'https://via.placeholder.com/200x300?text=No+Image',
//     days: 'N/A',
// };

export default ItineraryCard;