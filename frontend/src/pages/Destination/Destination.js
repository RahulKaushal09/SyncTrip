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

import { PageTypeEnum } from '../../utils/pageType'; // adjust path as needed
import { decryptData, encryptData } from '../../utils/securityStorage';
import Loader from '../../components/Loader/loader';
import { Helmet } from 'react-helmet-async';
import { metaTags } from '../../seoData/metaTags';
import { locationDataSchema } from '../../seoData/seoSchemas';
const DestinationPage = ({ ctaAction, handleIsLoading }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [hotelIds, setHotelids] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { locationId } = useParams();
    const [pageType, setPageType] = useState(null);
    const extractTextFromHTML = (htmlString) => {
        if (!htmlString) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.textContent || "";
    };
    const getRandomNumberReviews = () => {
        return Math.floor(Math.random() * 100) + 1;
    };
    useEffect(() => {
        const url = window.location.href;
        if (url.includes("/trips/")) {
            setPageType(PageTypeEnum.TRIP);
        } else if (url.includes("/location/")) {
            setPageType(PageTypeEnum.LOCATION);
        }
    }, []); // only run once when the component mounts
    // Effect to detect screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const fetchLocationDetails = async () => {
            setLoading(true);
            const now = new Date();
            const cacheKey = process.env.REACT_APP_CACHE_KEY || 'cached_locations';
            const expiryKey = process.env.REACT_APP_CACHE_EXPIRY_KEY || 'cached_locations_expiry';

            try {
                // Step 1: Try reading from cache
                const encryptedData = localStorage.getItem(cacheKey);
                const encryptedExpiry = localStorage.getItem(expiryKey);
                let cachedLocations = [];

                if (encryptedData && encryptedExpiry) {
                    const expiry = decryptData(encryptedExpiry);
                    if (expiry && new Date(expiry) > now) {
                        const decrypted = decryptData(encryptedData);
                        if (Array.isArray(decrypted)) {
                            cachedLocations = decrypted;

                            // ✅ Find the location in cache
                            const cachedLocation = cachedLocations.find(loc => loc._id === locationId);
                            if (cachedLocation) {
                                cachedLocation.title = extractTextFromHTML(
                                    cachedLocation?.title?.replace(/[0-9.]/g, '')
                                );
                                setHotelids(cachedLocation?.hotels || []);
                                setLocationData(cachedLocation);
                                return;
                            }
                        }
                    }
                }

                // Step 2: Not in cache – fetch from server
                const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/${locationId}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error(`Failed to fetch location: ${response.statusText}`);

                const location = await response.json();
                location.title = extractTextFromHTML(location?.title?.replace(/[0-9.]/g, ''));
                setHotelids(location?.hotels || []);
                setLocationData(location);

                // Step 3: Add to cache uniquely
                const updatedLocations = [...cachedLocations.filter(loc => loc._id !== locationId), location];
                const newExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

                localStorage.setItem(cacheKey, encryptData(updatedLocations));
                localStorage.setItem(expiryKey, encryptData(newExpiry.toISOString()));

            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLocationDetails();
    }, [locationId]);
    // Fetch location details
    // useEffect(() => {
    //     const fetchLocationDetails = async () => {
    //         // console.log('Starting fetch for locationId:', locationId);
    //         // handleIsLoading(true);
    //         setLoading(true);

    //         try {
    //             const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/${locationId}`;
    //             // console.log('Fetching from:', url);

    //             const locationResponse = await fetch(url, {
    //                 method: 'GET',
    //                 headers: { 'Content-Type': 'application/json' },
    //             });

    //             // console.log('Response status:', locationResponse.status);

    //             if (!locationResponse.ok) {
    //                 throw new Error(`Failed to fetch location: ${locationResponse.statusText}`);
    //             }

    //             const location = await locationResponse.json();
    //             // console.log('Raw API response:', location);
    //             location.title = location?.title?.replace(/[0-9. ]/g, '');
    //             location.title = extractTextFromHTML(location.title);
    //             setHotelids(location?.hotels);
    //             if (!location) {
    //                 throw new Error('Location data is empty or null');
    //             }

    //             setLocationData(location);
    //             // console.log('Setting locationData state:', location);

    //         } catch (err) {
    //             console.error('Fetch error:', err.message);
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //             // handleIsLoading(false);
    //         }
    //     };

    //     fetchLocationDetails();
    // }, [locationId]);


    // Log locationData when it updates
    // useEffect(() => {
    //     // console.log("useEffect triggered with locationData:", locationData);
    //     if (locationData) {
    //         console.log('locationData updated:', locationData);
    //     } else {
    //         console.log('locationData is still null');
    //     }
    // }, [locationData]);


    const meta = metaTags.location(locationData);
    if (loading) {
        return (
            <div className="loader-container">
                <Helmet>
                    <title>Explore Destination – Plan Your Trip with SyncTrip</title>
                    <meta
                        name="description"
                        content="Discover exciting destinations with SyncTrip. Plan your trip and explore top attractions."
                    />
                </Helmet>
                <Loader setLoadingState={loading} TextToShow="Loading Details" />
            </div>
        );
    }
    // Render when data is loaded
    return (
        <div className="DestinationPage">
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <link rel="canonical" href={`https://synctrip.in/location/${locationId}`} />

                {/* Open Graph */}
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.ogImage} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://synctrip.in/location/${locationId}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.ogImage} />

                {/* JSON-LD */}
                <script type="application/ld+json">{JSON.stringify(locationDataSchema(locationData))}</script>
            </Helmet>
            <LocationEventsDetails
                type="Explore"
                location={locationData?.title || 'Unknown Location'}
                title={locationData?.title || 'Destination'}
                rating={locationData?.rating || 'N/A'}
                country={locationData?.country || 'India'}
            />
            <LocationImageGallery locationImages={locationData?.photos} locationName={locationData?.title || 'Unknown Location'} />

            {isMobile && <AddLocationCard showBtns={true} pageType={pageType} btnsStyle={{ width: "45%" }} style={{ marginBottom: "50px", marginLeft: "0px" }} ctaAction={ctaAction} title={locationData?.title} rating={locationData?.rating} reviews={getRandomNumberReviews()} bestTime={locationData?.best_time} placesToVisit={locationData?.placesNumberToVisit || "10"} HotelsToStay={locationData?.hotels?.length || "10"} MainImage={locationData?.images[0]} />}

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? "col-lg-8" : "col-lg-12"}>
                    {!isMobile && <Discription pageType={pageType} shortDescription={locationData?.description || ""} fullDescription={locationData?.fullDetails?.full_description || ""} bestTime={locationData?.best_time} />}
                    <PlacesToVisitSection title={locationData?.title} placesIds={locationData?.placesToVisit} ctaAction={ctaAction} />
                    <PlanTripDates pageType={pageType} ctaAction={ctaAction} />
                    <LocationMapSection latitude={locationData?.fullDetails?.coordinates?.lat} longitude={locationData?.fullDetails?.coordinates?.long} />
                    <HotelsAndStaysSection hotelIds={hotelIds} locationName={locationData?.title} />
                </div>

                {!isMobile && (
                    <div className="col-lg-4">
                        <div
                            style={{
                                position: 'sticky',
                                top: '10px',
                                zIndex: 1000, // ensure it's above other content if needed
                            }}
                        >
                            <AddLocationCard
                                showBtns={true}
                                pageType={pageType}
                                ctaAction={ctaAction}
                                title={locationData?.title}
                                rating={locationData?.rating}
                                reviews={getRandomNumberReviews()}
                                bestTime={locationData?.best_time}
                                placesToVisit={locationData?.placesNumberToVisit || "10"}
                                HotelsToStay={locationData?.hotels?.length || "10"}
                                MainImage={locationData?.images[0]}
                            />
                        </div>
                    </div>
                )}
            </div>

            <SyncTripAppPushingSection showWork={false} ctaAction={ctaAction} />
        </div>
    );
};

export default DestinationPage;