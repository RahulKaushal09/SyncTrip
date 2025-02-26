import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
import '../../styles/itineraryCarousel.css'; // Custom CSS for styling and animation
import ItineraryCard from './card'; // Import the ItineraryCard component
import { Link } from 'react-router-dom'; // For navigation
const ItineraryCarousel = () => {
    // Sample data for Delhi itinerary cards (replace with actual image URLs)
    const itineraries = [
        {
            src: 'https://www.holidify.com/images/bgImages/ALLEPPEY.jpg', // Large card image
            title: 'Delhi',
            days: '3 Days',
            url: '/delhi'
        },
        {
            src: 'https://www.holidify.com/images/bgImages/ALLEPPEY.jpg', // Medium card image
            title: 'mumbai',
            days: '3 Days',
            url: '/mumbai'
        },
        {
            src: 'https://www.holidify.com/images/bgImages/ALLEPPEY.jpg', // Small card image
            title: 'kasol',
            days: '3 Days',
            url: '/kasol'
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const intervalRef = useRef(null);
    const cardCount = 3;

    const startRotation = () => {
        intervalRef.current = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % cardCount);
        }, 5000);
    };

    useEffect(() => {
        startRotation();
        return () => clearInterval(intervalRef.current);
    }, []);

    const getCardStyle = (offset) => {
        const position = (activeIndex + offset) % cardCount;
        let scale, translateX, zIndex, opacity;

        switch (position) {
            case 0: // Leftmost (largest)
                scale = 1.2;
                translateX = '-120%';
                zIndex = 3;
                opacity = 1;
                break;
            case 1: // Middle
                scale = 1;
                translateX = '0%';
                zIndex = 2;
                opacity = 1;
                break;
            case 2: // Rightmost (smallest)
                scale = 0.8;
                translateX = '120%';
                zIndex = 1;
                opacity = 1;
                break;
            default: // Hidden
                scale = 0;
                translateX = '240%';
                opacity = 0;
        }

        return {
            transform: `translateX(${translateX}) scale(${scale})`,
            zIndex,
            opacity,
        };
    };

    return (
        <div
            className="carousel-container"
            onMouseEnter={() => clearInterval(intervalRef.current)}
            onMouseLeave={startRotation}
        >

            {itineraries.map((itinerary, index) => (
                <div
                    key={index}
                    className="card"
                    style={getCardStyle(index)}
                >
                    <Link to={itinerary.url} className="card-link">
                        <ItineraryCard
                            name={itinerary.title}
                            imgSrc={itinerary.src}
                            days={itinerary.days}
                        />
                    </Link>
                </div>

            ))}
        </div>
    );
};

export default ItineraryCarousel;