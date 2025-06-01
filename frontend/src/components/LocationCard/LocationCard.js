import React from 'react';
import '../../styles/LocationCard.css'; // Optional: You can create a CSS file for styling
import { CiHeart } from "react-icons/ci";
import { Carousel } from 'react-bootstrap';
const LocationCard = ({ name, rating, places, bestTime, images, onClickFunction, Highlights, inlineStyle, imageInlineStyle }) => {
    return (

        <div className="location-card" style={inlineStyle}>

            <div className="card-image" >
                <Carousel
                    interval={null} // Disable auto-play (no automatic scrolling)
                    controls={images.length > 1 ? true : false} // Show navigation arrows (manual scrolling via arrows)
                    indicators={images.length > 1 ? true : false} // Show indicators (dots by default)
                    wrap={true} // Allow wrapping around to the first slide after the last

                >
                    {images && images.length > 0 ? (
                        images.map((image, index) => (
                            <Carousel.Item key={index} onClick={onClickFunction} style={{ cursor: "pointer" }}>
                                <img
                                    className="d-block" // Ensure the image takes full width
                                    src={image}
                                    alt={`Trip to ${name.replace(/[0-9.]/g, '')} `}
                                    style={{ objectFit: 'cover', ...imageInlineStyle }}
                                />
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <img
                                className="d-block"
                                src="https://via.placeholder.com/300x200?text=No+Image"
                                alt={`Trip to ${name} `}
                                style={{ objectFit: 'cover' }}
                            />
                        </Carousel.Item>
                    )}
                </Carousel>
                <CiHeart className="heart-icon" />
            </div>
            <div className="card-content" onClick={onClickFunction} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3>{name}</h3>
                    <div className="rating">
                        <span>★ {rating.split("/")[0].trim()}/5</span>
                    </div>
                </div>
                {places && <p>{places} places to visit</p>}
                {bestTime && <p>Best time: {bestTime}</p>}
                {Highlights && <p>{Highlights}</p>}

            </div>
        </div>
    );
};

export default LocationCard;