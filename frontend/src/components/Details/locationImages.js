import React, { useState, useEffect, useRef } from 'react';
import '../../styles/LocationImageGallery.css';

const LocationImageGallery = ({ locationImages }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const carouselRef = useRef(null);
    const [isUserInteracting, setIsUserInteracting] = useState(false);

    // Handle window resize to update isMobile dynamically
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (!isMobile || isUserInteracting || !carouselRef.current) return;

        const carousel = carouselRef.current;
        const imageWidth = carousel.offsetWidth; // Width of one image (100% of container)
        const totalImages = locationImages.length;
        let currentIndex = 0;

        const scrollToNextImage = () => {
            currentIndex = (currentIndex + 1) % totalImages; // Loop back to start
            carousel.scrollTo({
                left: currentIndex * imageWidth,
                behavior: 'smooth',
            });
        };

        const interval = setInterval(scrollToNextImage, 2000); // Scroll every 3 seconds

        return () => clearInterval(interval); // Cleanup on unmount or when conditions change
    }, [isMobile, isUserInteracting, locationImages]);

    // Handle user interaction to pause auto-scroll
    const handleInteractionStart = () => {
        setIsUserInteracting(true);
    };

    const handleInteractionEnd = () => {
        setTimeout(() => setIsUserInteracting(false), 2000); // Resume after 2 seconds of inactivity
    };

    const handleMoreImagesClick = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="location-gallery">
            {isMobile ? (
                <div
                    className="carousel-container"
                    ref={carouselRef}
                    onTouchStart={handleInteractionStart}
                    onTouchEnd={handleInteractionEnd}
                    onMouseDown={handleInteractionStart}
                    onMouseUp={handleInteractionEnd}
                    onScroll={handleInteractionStart} // Detect manual scroll
                >
                    {locationImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Location View ${index + 1}`}
                            className="carousel-image"
                            loading="lazy" // Optional: Improve performance
                        />
                    ))}
                </div>
            ) : (
                <div className="image-grid">
                    <img
                        src={locationImages[0]}
                        alt="Location View 1"
                        className="main-image"
                    />
                    <div className="right-grid">
                        {locationImages.slice(1, 4).map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Location View ${index + 2}`}
                                className={`right-image right-image-${index + 1}`}
                            />
                        ))}
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
            )}

            {!isMobile && isPopupOpen && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
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
                                    style={{ height: '200px', width: '200px' }}
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