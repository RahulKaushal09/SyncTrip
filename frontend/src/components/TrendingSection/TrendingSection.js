import React, { useState } from 'react';
import "../../styles/Trending.css";
import DestinationCard from './DestinationCard';
const TrendingSection = () => {
    const itineraries = [
        {
            src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
            title: "Delhi",
            days: "3 Days",
            url: "/delhi",
        },
        {
            src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
            title: "Mumbai",
            days: "3 Days",
            url: "/mumbai",
        },
        {
            src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
            title: "Kasol",
            days: "3 Days",
            url: "/kasol",
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? itineraries.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === itineraries.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <section className="">
            <h1 className="text-start fw-bold majorHeadings">Stay updated on what's Trending</h1>

            <div className="carousel-container position-relative">
                <div className="d-flex justify-content-center align-items-center">
                    <DestinationCard />
                    {/* <button
                        className="carousel-control custom-control-prev"
                        onClick={handlePrev}
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button> */}

                    {/* <div className="carousel-inner d-flex justify-content-center">
                        {itineraries.map((itinerary, index) => (
                            <div
                                key={itinerary.url}
                                className={`card trending-card border-0 shadow-sm ${index === activeIndex ? 'active' : 'inactive'}`}
                                style={{ display: index === activeIndex ? 'block' : 'none' }}
                            >
                                <img
                                    src={itinerary.src}
                                    className="card-img-top"
                                    alt={itinerary.title}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title fw-bold">{itinerary.title}</h5>
                                    <p className="card-text text-muted">
                                        {itinerary.days} <br />
                                        Aryan & 24 others visited this month
                                    </p>
                                    <div className="avatars d-flex justify-content-center gap-2 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <img
                                                key={i}
                                                src="https://via.placeholder.com/30"
                                                alt={`User ${i + 1}`}
                                                className="rounded-circle"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div> */}

                    {/* <button
                        className="carousel-control custom-control-next"
                        onClick={handleNext}
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button> */}
                </div>

                <div className="text-center mt-4">
                    <button className="btn btn-dark btn-lg px-4">
                        Explore more
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TrendingSection;