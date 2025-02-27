import React from 'react';
import "../../styles/DestinationCard.css";

const DestinationCard = () => {
    return (
        <div className="card destination-card border-0 shadow-sm">
            <img
                src="https://www.holidify.com/images/bgImages/ALLEPPEY.jpg"
                className="card-img-top"
                alt="Berlin Brandenburg Gate"
            />
            <div className="card-body text-center">
                <h5 className="card-title fw-bold">Top Destination of 2024</h5>
                <p className="card-text text-muted">
                    Kurli, Koembatur <br />
                    Aryan & 24 others visited this month
                </p>
                <div className="avatars d-flex justify-content-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <img
                            key={i}
                            src="https://www.holidify.com/images/bgImages/ALLEPPEY.jpg"
                            alt={`User ${i + 1}`}
                            className="rounded-circle"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;