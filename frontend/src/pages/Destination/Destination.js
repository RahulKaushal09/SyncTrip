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

const DestinationPage = ({ ctaAction, handleIsLoading }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [placesToVisit, setPlacesToVisit] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { locationId } = useParams();
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
            console.log('Starting fetch for locationId:', locationId);
            // handleIsLoading(true);
            setLoading(true);

            try {
                const url = `http://localhost:5000/api/locations/${locationId}`;
                console.log('Fetching from:', url);

                const locationResponse = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                console.log('Response status:', locationResponse.status);

                if (!locationResponse.ok) {
                    throw new Error(`Failed to fetch location: ${locationResponse.statusText}`);
                }

                const location = await locationResponse.json();
                console.log('Raw API response:', location);
                location.title = location?.title?.replace(/[0-9. ]/g, '');
                location.title = extractTextFromHTML(location.title);
                if (!location) {
                    throw new Error('Location data is empty or null');
                }

                setLocationData(location);
                console.log('Setting locationData state:', location);

            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
                // handleIsLoading(false);
            }
        };

        fetchLocationDetails();
    }, [locationId]);
    // Log locationData when it updates
    useEffect(() => {
        console.log("useEffect triggered with locationData:", locationData);
        if (locationData) {
            console.log('locationData updated:', locationData);
        } else {
            console.log('locationData is still null');
        }
    }, [locationData]);


    if (!locationData) {
        return <p>Loading...</p>; // Or any placeholder UI
    }
    else {
        console.log("locationData:", locationData);
    }

    // Render when data is loaded
    return (
        <div className="DestinationPage">
            <LocationEventsDetails
                type="Explore"
                location={locationData?.title || 'Unknown Location'}
                title={locationData?.title || 'Destination'}
                rating={locationData?.rating || 'N/A'}
                country={locationData?.country || 'India'}
            />
            <LocationImageGallery locationImages={locationData?.photos} />

            {isMobile && <AddLocationCard ctaAction={ctaAction} title={locationData?.title} rating={locationData?.rating} reviews={getRandomNumberReviews} bestTime={locationData?.best_time} placesToVisit={locationData?.placesNumberToVisit || "10"} MainImage={locationData?.images[0]} />}

            <div className="row" style={{ position: 'relative' }}>
                <div className="col-lg-8">
                    {!isMobile && <Discription shortDescription={locationData?.description || ""} fullDescription={locationData?.fullDetails?.full_description || ""} bestTime={locationData?.best_time} />}
                    <HotelsAndStaysSection hotels={hotels} />
                    <PlanTripDates ctaAction={ctaAction} />
                    <LocationMapSection coordinates={locationData?.coordinates} />
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
                        <AddLocationCard ctaAction={ctaAction} title={locationData?.title} rating={locationData?.rating} reviews={getRandomNumberReviews()} bestTime={locationData?.best_time} placesToVisit={locationData?.placesNumberToVisit || "10"} MainImage={locationData?.images[0]} />
                    </div>
                )}
            </div>

            <SyncTripAppPushingSection showWork={false} ctaAction={ctaAction} />
        </div>
    );
};

export default DestinationPage;