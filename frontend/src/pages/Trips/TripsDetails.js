import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LocationEventsDetails from '../../components/Details/locationEventsDetials';
import LocationImageGallery from '../../components/Details/locationImages';
import AddLocationCard from '../../components/Details/AddLocationCard';
import Discription from '../../components/Details/description';
import HotelsAndStaysSection from '../../components/Details/HotelSection';
import PlanTripDates from '../../components/Details/PlanTripDates';
import LocationMapSection from '../../components/Details/MapSection';
import PlacesToVisitSection from '../../components/Details/PlacesToVisit';
import SyncTripAppPushingSection from '../../components/AppPushingSection/AppPushingSection';

const TripsDetialsPage = ({ ctaAction, handleIsLoading, type }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [tripData, setTripData] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [placesToVisit, setPlacesToVisit] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { tripId } = useParams();
    const extractTextFromHTML = (htmlString) => {
        if (!htmlString) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.textContent || "";
    };
    const getRandomNumberReviews = () => {
        return Math.floor(Math.random() * 100) + 1;
    };
    // Effect to detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch location details
    useEffect(() => {
        const fetchLocationDetails = async () => {
            console.log('Starting fetch for locationId:', tripId);
            // handleIsLoading(true);
            setLoading(true);

            try {
                const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/${tripId}`;
                console.log('Fetching from:', url);

                const TripResponse = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                console.log('Response status:', TripResponse.status);

                if (!TripResponse.ok) {
                    throw new Error(`Failed to fetch location: ${TripResponse.statusText}`);
                }

                const trip = await TripResponse.json();
                console.log('Raw API response:', trip);
                trip.title = trip?.title?.replace(/[0-9. ]/g, '');
                trip.title = extractTextFromHTML(trip.title);
                if (!trip) {
                    throw new Error('Location data is empty or null');
                }

                setTripData(trip);
                console.log('Setting locationData state:', trip);

            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
                // handleIsLoading(false);
            }
        };

        fetchLocationDetails();
    }, [tripId]);
    // Log tripData when it updates
    useEffect(() => {
        console.log("useEffect triggered with tripData:", tripData);
        if (tripData) {
            console.log('tripData updated:', tripData);
        } else {
            console.log('tripData is still null');
        }
    }, [tripData]);


    if (!tripData) {
        return <p>Loading...</p>; // Or any placeholder UI
    }
    else {
        console.log("locationData:", tripData);
    }

    // Render when data is loaded
    return (
        <div className="DestinationPage">
            <LocationEventsDetails
                type="Explore"
                location={tripData?.title || 'Unknown Location'}
                title={tripData?.title || 'Destination'}
                rating={tripData?.rating || 'N/A'}
                country={tripData?.country || 'India'}
            />
            <LocationImageGallery locationImages={tripData?.photos} />

            {isMobile && <AddLocationCard ctaAction={ctaAction} title={tripData?.title} rating={tripData?.rating} reviews={getRandomNumberReviews} bestTime={tripData?.best_time} placesToVisit={tripData?.placesNumberToVisit || "10"} MainImage={tripData?.images[0]} />}

            <div className="row" style={{ position: 'relative' }}>
                <div className="col-lg-8">
                    {!isMobile && <Discription shortDescription={tripData?.description || ""} fullDescription={tripData?.fullDetails?.full_description || ""} bestTime={tripData?.best_time} />}
                    <HotelsAndStaysSection hotels={hotels} />
                    <PlanTripDates ctaAction={ctaAction} />
                    <LocationMapSection coordinates={tripData?.coordinates} />
                    <PlacesToVisitSection places={placesToVisit} ctaAction={ctaAction} />
                </div>

                {!isMobile && (
                    <div
                        className="col-lg-4"
                        style={{
                            position: 'sticky',
                            top: '0px',
                            right: '0px',
                        }}
                    >
                        <AddLocationCard ctaAction={ctaAction} title={tripData?.title} rating={tripData?.rating} reviews={getRandomNumberReviews()} bestTime={tripData?.best_time} placesToVisit={tripData?.placesNumberToVisit || "10"} MainImage={tripData?.images[0]} />
                    </div>
                )}
            </div>

            <SyncTripAppPushingSection showWork={false} ctaAction={ctaAction} />
        </div>
    );
};

export default TripsDetialsPage;