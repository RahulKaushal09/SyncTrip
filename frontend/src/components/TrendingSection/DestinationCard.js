import React from 'react';
import "../../styles/DestinationCard.css";

const DestinationCard = () => {
    return (
        <div
            className="card destination-card border-0 "
            style={{
                backgroundColor: 'rgba(101, 202, 211, 0.22)', // #65CAD3 with 22% opacity
                padding: '20px', // Adding padding on all sides to match the image
                backdropFilter: 'blur(5px)', // Adds blur effect to the background
                WebkitBackdropFilter: 'blur(5px)', // For Safari support
            }}
        >
            <div
                className="card destination-card border-0"
                style={{ background: "transparent" }}
            >
                <img
                    src="https://www.holidify.com/images/bgImages/ALLEPPEY.jpg"
                    className="card-img-top"
                    alt="Berlin Brandenburg Gate"
                    style={{ borderRadius: '10px 10px 0 0' }} // Matches rounded corners of the image
                />
                <div className="card-body-destination text-center">
                    <h5 className="card-title-destination fw-bold">Top Destination of 2024</h5>
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
                                style={{ width: '30px', height: '30px' }} // Matches avatar size
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DestinationCard;