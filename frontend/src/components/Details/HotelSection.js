import React, { useState, useEffect } from 'react';
import '../../styles/HotelSection.css'; // We'll create this CSS file separately
import { CiHeart } from "react-icons/ci";

const HotelImageCarousel = ({ images, locationName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [validImages, setValidImages] = useState([]);

    // Handle next image
    useEffect(() => {
        const loadImages = async () => {
            const promises = images.map((url) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.src = url;
                    img.onload = () => resolve(url);   // valid
                    img.onerror = () => resolve(null); // invalid
                })
            );

            const results = await Promise.all(promises);
            const filtered = results.filter((url) => url !== null);
            setValidImages(filtered);
            setCurrentIndex(0); // reset to 0
        };

        loadImages();
    }, [images]);
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
    if (validImages.length === 0) validImages.push("https://wbksuxwcqnzuppviunfz.supabase.co/storage/v1/object/public/hotel-images//emptyState.jpg"); // Placeholder if no valid images

    return (
        <div className="carousel" style={{ position: 'relative', width: '100%' }}>
            {/* Display current image */}
            <img
                src={validImages[currentIndex]}
                alt={`${locationName}`}
                className="hotel-image"
            // style={{ width: '100%', height: 'auto' }}
            />

            {/* Previous button */}
            {validImages.length > 1 && (
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
            )}
            {validImages.length > 1 && (

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
            )}

            {/* Optional: Dots for navigation */}

            <div className='coursel-dots-custom'>
                {validImages.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        alt={locationName}
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
const HotelCard = ({ hotel, locationName }) => {


    return (
        <div className="hotel-card">{/*//onClick={() => window.location.href = hotel?.hotel_link} style={{ cursor: 'pointer' }} onclick={hotel?.hotel_link}>*/}
            <div className='top-rated'>Top Rated</div>
            <CiHeart className="heart-icon" />
            <HotelImageCarousel images={hotel.hotel_images} locationName={locationName} />
            {/* <img src={hotel.hotel_images[0]} alt="Hotel" className="hotel-image" /> */}
            <div className="card-content-hotel">
                <div className="rating-hotel">
                    <span className="stars">★</span> <strong>{hotel.hotel_location.rating.score}</strong> (672 reviews)
                </div>
                <h3>{hotel.hotel_name.replace(/[0-9.]/g, '')}</h3>
                <p>{hotel.hotel_location.neighbourhood}</p>
                {/* <div className='d-flex justify-content-between align-items-center'>
                    <div classPrice="price">
                        <strong>2,000</strong> / onwards
                    </div>
                    <div className="btn btn-black">Explore</div>
                </div> */}
            </div>
        </div>
    );
};

const HotelsAndStaysSection = ({ hotelIds, locationName }) => {
    // Sample image URLs (replace with actual hotel images)
    const [hotels, setHotels] = useState([]); // State to store fetched hotels
    const [activeHotelShow, setActiveHotelShow] = useState(4);
    const [previousShowMore, setPreviousShowMore] = useState(4); // State to track the number of hotels shown
    useEffect(() => {
        const fetchHotels = async () => {
            if (!hotelIds || hotelIds.length === 0) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/hotels/getHotelsByIds`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hotelIds }),
                });

                if (!response.ok) throw new Error('Failed to fetch hotels');
                const data = await response.json();

                const validateImages = async (urls) => {
                    const checks = urls.map(url =>
                        new Promise((resolve) => {
                            const img = new Image();
                            img.src = url;
                            img.onload = () => resolve(true);
                            img.onerror = () => resolve(false);
                        })
                    );
                    const results = await Promise.all(checks);
                    return results.filter(Boolean).length; // count of valid images
                };

                const hotelsWithValidImageCount = await Promise.all(
                    data.map(async (hotel) => {
                        const validCount = await validateImages(hotel.hotel_images || []);
                        return { ...hotel, validImageCount: validCount };
                    })
                );

                // Sort: hotels with valid images first
                hotelsWithValidImageCount.sort((a, b) => b.validImageCount - a.validImageCount);

                setHotels(hotelsWithValidImageCount);
            } catch (err) {
                console.error(err.message);
            }
        };
        // const fetchHotels = async () => {
        //     if (!hotelIds || hotelIds.length === 0) return; // Avoid making a request if no hotelIds are available

        //     try {
        //         const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/hotels/getHotelsByIds`, {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({ hotelIds }), // Send array of hotel ObjectIds
        //         });
        //         if (!response.ok) throw new Error('Failed to fetch hotels');
        //         const data = await response.json();
        //         setHotels(data); // Store the fetched hotels in state
        //     } catch (err) {
        //         console.error(err.message);
        //     }
        // };

        fetchHotels();
    }, [hotelIds]); // Re-run when hotelIds change
    if (!hotels || hotels.length === 0) {
        return <div></div>;
    }
    return (
        <div className="hotels-container">

            <h2 className='DescriptionHeading'><strong>Hotels & Stays {locationName ? "in " + locationName : ""} </strong></h2>
            <div className="hotels-grid">
                {hotels.slice(0, activeHotelShow).map((hotel, index) => (
                    <HotelCard key={index} hotel={hotel} locationName={"Top " + index + " hotels in " + locationName} />
                )
                    // <HotelCard key={index} imageUrl={image} />
                )}

            </div>
            {hotels.length > 10 && previousShowMore < hotels.length && (
                <button
                    className='view-more-btn mt-4'
                    onClick={() => {
                        setActiveHotelShow(prev => prev + 6);
                        setPreviousShowMore(activeHotelShow + 6);
                        if (previousShowMore >= hotels.length) {
                            setActiveHotelShow(hotels.length);
                            setPreviousShowMore(hotels.length);
                        }
                    }}
                >
                    Load More
                </button>
            )}
            {/* <hr></hr> */}


        </div>
    );
};

export default HotelsAndStaysSection;