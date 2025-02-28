import React, { useState } from 'react';
import "../../styles/DestinationCard.css";

const DestinationCard = ({ imgUrl, Title, Location, peopleVisited }) => {
    return (
        <div className="card destination-card border-0">
            <div
                className="card-img-container"
                style={{
                    background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '350px',
                    borderRadius: '22px',
                    display: "flex",
                    alignItems: "flex-end",
                }}
            >
                <h5 className="card-title-destination fw-bold text-white text-start" style={{ fontSize: '30px', marginLeft: "10px" }}>
                    {Title}
                </h5>
            </div>
            <div className="card-body-destination text-center" style={{ padding: '15px 15px 0px 15px' }}>
                <p className="card-text-destination">
                    {Location}
                </p>
                <div className="avatars d-flex justify-content-center gap-2">
                    {[...Array(5)].map((_, i) => (
                        <img
                            key={i}
                            src={`${imgUrl}?text=User${i + 1}`}
                            alt={`User ${i + 1}`}
                            className="rounded-circle"
                            style={{ width: '25px', height: '25px', border: '1px solid white', marginRight: "-15px" }}
                        />
                    ))}
                    <p style={{ marginLeft: "10px", fontSize: "14px", fontWeight: "700" }}>
                        {peopleVisited}
                    </p>
                </div>
            </div>
        </div>
    );
};

const DestinationCardLayout = () => {
    const [positions, setPositions] = useState([0, 1, 2]);

    const cardData = [
        {
            imgUrl: 'https://www.holidify.com/images/bgImages/ALLEPPEY.jpg',
            Title: 'Top Destination of 2024',
            Location: 'Kurli, Koembatur',
            peopleVisited: 'Aryan & 24 others visited this month'
        },
        {
            imgUrl: 'https://www.holidify.com/images/bgImages/GOA.jpg',
            Title: 'Beaches of Goa',
            Location: 'Goa, India',
            peopleVisited: 'Priya & 15 others visited this month'
        },
        {
            imgUrl: 'https://www.holidify.com/images/bgImages/MANALI.jpg',
            Title: 'Snowy Peaks of Manali',
            Location: 'Manali, Himachal Pradesh',
            peopleVisited: 'Rohan & 30 others visited this month'
        }
    ];

    const rotateLeft = () => {
        setPositions(prev => [prev[1], prev[2], prev[0]]);
    };

    const rotateRight = () => {
        setPositions(prev => [prev[2], prev[0], prev[1]]);
    };

    return (
        <div className="destination-card-container">
            <button className="arrow-button left-arrow" onClick={rotateLeft}>
                ‹
            </button>

            <div className={`card-item position-${positions[0]}`}>
                <DestinationCard {...cardData[0]} />
            </div>
            <div className={`card-item position-${positions[1]}`}>
                <DestinationCard {...cardData[1]} />
            </div>
            <div className={`card-item position-${positions[2]}`}>
                <DestinationCard {...cardData[2]} />
            </div>

            <button className="arrow-button right-arrow" onClick={rotateRight}>
                ›
            </button>
        </div>
    );
};

export default DestinationCardLayout;