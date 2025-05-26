import React, { useState, useEffect } from 'react';
import TripSection from '../../components/Trips/TripSection';
import '../../styles/trips/Trip.css';

const Trips = () => {
    const [trips, setTrips] = useState([]);
    const [enrolledTrips, setEnrolledTrips] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [token, setToken] = useState(localStorage.getItem('userToken') || ''); // Default to empty string
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('userToken')); // True if token exists
    // Handle window resize for mobile detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Listen for storage changes (e.g., login/logout from navbar)
    useEffect(() => {
        const handleStorageChange = () => {
            const newToken = localStorage.getItem('userToken') || '';
            setToken(newToken);
            setIsLoggedIn(!!newToken); // Update login status
        };

        // Initial check
        handleStorageChange();

        // Listen for storage events (fired by other tabs or manual updates)
        window.addEventListener('storage', handleStorageChange);

        // Custom event for same-tab updates (if navbar dispatches it)
        window.addEventListener('authChange', handleStorageChange);

        // return () => {
        //     window.removeEventListener('storage', handleStorageChange);
        //     window.removeEventListener('authChange', handleStorageChange);
        // };
    }, []);

    // Fetch trips when token or login status changes
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

                if (
                    allTripsResponse.status === 404
                ) {
                    setError('No trips found. Please check back later.');
                    return;
                } //throw new Error('Failed to fetch all trips');
                const allTripsData = await allTripsResponse.json();
                setTrips(allTripsData.trips);

                // Fetch enrolled trips if logged in
                if (isLoggedIn && token) {
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
                } else {
                    setEnrolledTrips([]); // Clear enrolled trips if not logged in
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrips();
    }, [token, isLoggedIn]); // Re-run when token or login status changes

    // Filter trips based on active tab
    const getFilteredTrips = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (activeTab) {
            case 'upcoming':
                return trips.filter((trip) => {
                    var fromDate = new Date();
                    for (var i = 0; i < trip.essentials.timelines.length; i++) {
                        if (new Date(trip.essentials.timelines[i].fromDate) > fromDate) {
                            fromDate = new Date(trip.essentials.timelines[i].fromDate);
                            // break;
                        }
                    }
                    // const fromDate = new Date(trip.essentials.timeline.fromDate);
                    return fromDate >= today && ['active', 'scheduled'].includes(trip.requirements.status);
                });
            case 'enrolled':
                return enrolledTrips;
            case 'history':

                return trips.filter((trip) => {
                    var fromDate = new Date() - 1; // Initialize to yesterday
                    for (var i = 0; i < trip.essentials.timelines.length; i++) {
                        if (new Date(trip.essentials.timelines[i].fromDate) > fromDate) {
                            fromDate = new Date(trip.essentials.timelines[i].fromDate);
                            // break;
                        }
                    }
                    // const fromDate = new Date(trip.essentials.timeline.fromDate);
                    return fromDate < today || trip.requirements.status === 'completed';
                });
            default:
                return trips;
        }
    };
    const filteredTrips = getFilteredTrips();

    return (
        <div className="trips-container">
            <div className="tabs">
                <button
                    className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming {!isMobile ? 'Trips' : ''}
                </button>
                {isLoggedIn && (
                    <button
                        className={`tab-button ${activeTab === 'enrolled' ? 'active' : ''}`}
                        onClick={() => setActiveTab('enrolled')}
                    >
                        Enrolled {!isMobile ? 'Trips' : ''}
                    </button>
                )}
                <button
                    className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    {!isMobile ? 'Trips ' : ''}History
                </button>
            </div>

            {/* {isLoading ? ( */}

            {/* // <p className="status-message">Loading trips...</p> */}
            {/* {error ? (
                <p className="status-message error">{error}</p>
            ) : ( */}
            <TripSection activeTab={activeTab} trips={filteredTrips} isLoading={isLoading} error={error} />
            {/* )} */}
        </div>
    );
};

export default Trips;