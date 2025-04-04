import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../styles/itineraryCarousel.css";
import ItineraryCard from "./card";

const ItineraryCarousel = ({ locations }) => {

    const itineraries = locations.slice(0, 4); // Select up to 4 random locations
    // const itineraries = [
    //     {
    //         src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
    //         title: "Delhi",
    //         days: "3 Days",
    //         url: "/delhi",
    //     },
    //     {
    //         src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
    //         title: "Mumbai",
    //         days: "3 Days",
    //         url: "/mumbai",
    //     },
    //     {
    //         src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
    //         title: "Kasol",
    //         days: "3 Days",
    //         url: "/kasol",
    //     },
    //     {
    //         src: "https://www.holidify.com/images/bgImages/ALLEPPEY.jpg",
    //         title: "Kasol",
    //         days: "3 Days",
    //         url: "/kasol",
    //     },
    // ];

    const [cycleOffset, setCycleOffset] = useState(0);
    const intervalRef = useRef(null);
    const cardCount = itineraries.length;
    console.log(cardCount, "cardCount");


    useEffect(() => {
        if (cardCount > 1) {
            startRotation();
        } else {
            clearInterval(intervalRef.current); // Stop rotation if data is not yet available
        }
        return () => clearInterval(intervalRef.current);
    }, [cardCount]);

    const startRotation = () => {
        console.log("cardCountinterval", cardCount);
        intervalRef.current = setInterval(() => {
            setCycleOffset((prev) => (prev + 1) % cardCount);
        }, 5000);
    };

    const getCardStyles = (index) => {
        const position = (index + cycleOffset) % cardCount;
        const isMobile = window.innerWidth <= 768;

        let styles = {
            transform: "",
            zIndex: "",
            opacity: "",
            transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
        };

        if (isMobile) {
            switch (position) {
                case 0: // Left
                    styles.transform = "translateX(-100%) scale(0.8)";
                    styles.zIndex = 1;
                    styles.opacity = 1;
                    break;
                case 1: // Middle (Largest)
                    styles.transform = "translateX(0%) scale(1.2)";
                    styles.zIndex = 3;
                    styles.opacity = 1;
                    break;
                case 2: // Right
                    styles.transform = "translateX(100%) scale(0.8)";
                    styles.zIndex = 1;
                    styles.opacity = 1;
                    break;
                default:
                    styles.transform = "translateX(240%) scale(0)";
                    styles.opacity = 0;
            }
        } else {
            switch (position) {
                case 0: // Leftmost (Largest)
                    styles.transform = "translateX(-150%) scale(1.2)";
                    styles.zIndex = 3;
                    styles.opacity = 1;
                    break;
                case 1: // Middle
                    styles.transform = "translateX(0%) scale(1)";
                    styles.zIndex = 2;
                    styles.opacity = 1;
                    break;
                case 2: // Rightmost (Smallest)
                    styles.transform = "translateX(120%) scale(0.8)";
                    styles.zIndex = 1;
                    styles.opacity = 1;
                    break;
                case 3:
                    styles.transform = "translateX(160%) scale(0.4)";
                    styles.zIndex = 4;
                    styles.opacity = 1;
                default:
                    styles.transform = "translateX(205%) scale(0.4)";
                    styles.opacity = 1;
                    styles.zIndex = 4;

            }
        }

        return styles;
    };

    const getShadowStyles = (index) => {
        const cardStyles = getCardStyles(index);
        // Extract scale from cardStyles.transform to adjust shadow size
        const scaleMatch = cardStyles.transform.match(/scale\(([^)]+)\)/);
        const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

        return {
            transform: `${cardStyles.transform.replace(/scale\([^)]+\)/, "")} translateY(280px) scale(${scale * 0.6}, ${scale * 0.3})`, // Elliptical shadow below
            zIndex: cardStyles.zIndex - 1, // Behind the card
            opacity: 0.4, // Subtle shadow
            transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
        };
    };

    return (
        <div
            className="carousel-container-itinerary"
            onMouseEnter={() => clearInterval(intervalRef.current)}
            onMouseLeave={startRotation}
        >
            {itineraries.map((itinerary, index) => {
                console.log("index", index);
                console.log("cycleOffset", cycleOffset);
                const cardStyles = getCardStyles(index);
                const shadowStyles = getShadowStyles(index);
                return (
                    <div key={index} className="card-wrapper-itinerary ">
                        <div className="card-shadow-itinerary" style={shadowStyles}></div>
                        <div className="card-itinearyShow" style={cardStyles}>
                            <Link to={`/location/${itinerary._id}`} className="card-link">
                                <ItineraryCard
                                    name={itinerary.title.replace(/[0-9. ]/g, "")}
                                    imgSrc={itinerary.images?.length > 0
                                        ? itinerary.images[0] : ""}
                                    days={itinerary.days ? itinerary.days : "3 Days"}
                                />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ItineraryCarousel;