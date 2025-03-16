import React, { useState } from 'react';
import '../../styles/LocationImageGallery.css'; // Updated CSS for responsiveness
import location from '../../data/locations.json'; // Import the JSON file

const LocationImageGallery = ({ locationImages }) => {
    // const locationImages = location[0].photos;

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleMoreImagesClick = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="location-gallery">
            <div className="image-grid">
                {/* First image taking 50% of the width (left side) */}
                <img
                    src={locationImages[0]}
                    alt="Location View 1"
                    className="main-image"
                />
                {/* Four images taking 50% of the width (right side), split into 25% each */}
                <div className="right-grid">
                    {locationImages.slice(1, 4).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Location View ${index + 2}`}
                            className={`right-image right-image-${index + 1}`}
                        />
                    ))}
                    {/* Last image container with "+5" for the popup */}
                    <div className="last-image-container">
                        <img
                            src={locationImages[4]}
                            alt="Location View 5"
                            className="right-image right-image-4"
                        />
                        <div className="more-images-button" onClick={handleMoreImagesClick}>
                            <p>+5</p>
                        </div>
                    </div>
                </div>
            </div>

            {isPopupOpen && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content">
                        <button className="close-button" onClick={closePopup}>
                            ×
                        </button>
                        <div className="popup-images">
                            {locationImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Location View ${index + 1}`}
                                    className="popup-image"
                                    style={{ height: '200px', width: '200px' }} // Predefined size
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationImageGallery;