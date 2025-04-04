import React, { useState } from 'react';
import TripCard from './TripCard.js'; // Import the TripCard component from the previous response
import "../../styles/trips/tripSection.css";
import MainSearchBar from '../SearchPanel/MainSeachBar.js';
const TripSection = ({ trips }) => {
    const [searchTerm, setSearchTerm] = useState('');
    // Handle Search Input
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };
    return (
        <div className="tripSection">
            {/* Header Section */}
            <div className="tripSection-header">
                <h1>Discover & Join Exciting Trips Near You!</h1>
                <p>
                    Ready for your next adventure? Explore upcoming trips, sign up, and connect with fellow travelers before the journey begins!
                </p>
            </div>

            {/* Search Bar */}
            <MainSearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} searchBarPlaceHolder={"Search Trips"} />


            {/* Trip Cards Grid */}
            <div className="tripSection-cards">
                {trips.map((trip, index) => (
                    <TripCard key={index} trip={trip} onClickFunction={(locationId) => {
                        window.location.href = `/trips/${trip._id}`;
                    }} />
                ))}
            </div>
        </div>
    );
};

export default TripSection;