import React, { useEffect, useState } from 'react';
import TripSection from '../../components/Trips/TripSection';
import '../../styles/trips/Trip.css'; // Import the CSS file for tabs

const Trips = () => {
    const [trips, setTrips] = useState([]); // All trips
    const [enrolledTrips, setEnrolledTrips] = useState([]); // User's enrolled trips
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming'); // Track active tab
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Check if the device is mobile
    // Get token from local storage (or your auth system)
    const token = localStorage.getItem('userToken'); // Replace with your auth method
    const isLoggedIn = !!token; // Check if user is logged in

    useEffect(() => {
        const fetchTrips = async () => {
            setIsLoading(true);
            try {
                // Fetch all trips
                const allTripsResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/getAllTrips`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ limit: 100 }),
                });

                if (!allTripsResponse.ok) throw new Error('Failed to fetch all trips');

                const allTripsData = await allTripsResponse.json();
                setTrips(allTripsData);

                // Fetch enrolled trips only if logged in
                if (isLoggedIn) {
                    const enrolledTripsResponse = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/en/enrolled`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!enrolledTripsResponse.ok) throw new Error('Failed to fetch enrolled trips');

                    const enrolledTripsData = await enrolledTripsResponse.json();
                    setEnrolledTrips(enrolledTripsData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, [token, isLoggedIn]);

    // Filter trips based on the active tab
    const getFilteredTrips = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        switch (activeTab) {
            case 'upcoming':
                return trips.filter((trip) => {
                    const fromDate = new Date(trip.essentials.timeline.fromDate);
                    return fromDate >= today && ['active', 'scheduled'].includes(trip.requirements.status);
                });
            case 'enrolled':
                return enrolledTrips; // Already fetched as enrolled trips
            case 'history':
                return trips.filter((trip) => {
                    const fromDate = new Date(trip.essentials.timeline.fromDate);
                    return fromDate < today || trip.requirements.status === 'completed';
                });
            default:
                return trips;
        }
    };

    const filteredTrips = getFilteredTrips();

    return (
        <div className="trips-container">
            {/* Tab Navigation */}
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming {!isMobile ? "Trips" : ""}
                </button>
                {isLoggedIn && (
                    <button
                        className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('enrolled')}
                    >
                        Enrolled {!isMobile ? "Trips" : ""}
                    </button>
                )}
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    {!isMobile ? "Trips" : ""} History
                </button>
            </div>

            {/* Loading, Error, and Empty States */}
            {isLoading ? (
                <p className="status-message">Loading trips...</p>
            ) : error ? (
                <p className="status-message error">{error}</p>
            ) : (
                <TripSection activeTab={activeTab} trips={filteredTrips} />
            )}
        </div>
    );
};

export default Trips;