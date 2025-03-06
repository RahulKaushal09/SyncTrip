import React, { useState } from 'react';
import '../../styles/HotelSection.css'; // We'll create this CSS file separately
import location from "../../data/locations.json";
import { CiHeart } from "react-icons/ci";

const HotelImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    // Handle next image

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    // Handle previous image
    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="carousel" style={{ position: 'relative', width: '100%' }}>
            {/* Display current image */}
            <img
                src={images[currentIndex]}
                alt={`Hotel image ${currentIndex + 1}`}
                className="hotel-image"
            // style={{ width: '100%', height: 'auto' }}
            />

            {/* Previous button */}
            <button
                onClick={prevImage}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    background: "transparent",
                    // background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    cursor: 'pointer'
                }}
            >
                &#10094; {/* Left arrow */}
            </button>

            {/* Next button */}
            <button
                onClick={nextImage}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    background: "transparent",
                    // background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    cursor: 'pointer'
                }}
            >
                &#10095; {/* Right arrow */}
            </button>

            {/* Optional: Dots for navigation */}
            <div className='coursel-dots-custom'>
                {images.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        style={{
                            height: '10px',
                            width: '10px',
                            backgroundColor: currentIndex === index ? '#333' : '#ccc',
                            borderRadius: '50%',
                            display: 'inline-block',
                            margin: '0 5px',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
const HotelCard = ({ hotel }) => {

    // console.log(hotel);

    return (
        <div className="hotel-card">
            <div className='top-rated'>Top Rated</div>
            <CiHeart className="heart-icon" />
            <HotelImageCarousel images={hotel.hotel_images} />
            {/* <img src={hotel.hotel_images[0]} alt="Hotel" className="hotel-image" /> */}
            <div className="card-content">
                <div className="rating">
                    <span className="stars">★</span> <strong>{hotel.hotel_location.rating.score}</strong> (672 reviews)
                </div>
                <h3>{hotel.hotel_name}</h3>
                <p>{hotel.hotel_location.neighbourhood}</p>
                <div className='d-flex justify-content-between align-items-center'>
                    <div classPrice="price">
                        <strong>2,000</strong> / onwards
                    </div>
                    <div className="btn btn-black">Explore</div>
                </div>
            </div>
        </div>
    );
};

const HotelsAndStaysSection = () => {
    // Sample image URLs (replace with actual hotel images)

    const [activeHotelShow, setActiveHotelShow] = useState(4);


    return (
        <div className="hotels-container">
            <h2 className='DescriptionHeading'>Hotels & Stays</h2>
            <div className="hotels-grid">
                {location[0].hotels.slice(0, activeHotelShow).map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} />
                )
                    // <HotelCard key={index} imageUrl={image} />
                )}

            </div>
            <div
                className='view-more-btn mt-5'
                onClick={() => setActiveHotelShow(10)}
            >
                Load More

            </div>
        </div>
    );
};

export default HotelsAndStaysSection;