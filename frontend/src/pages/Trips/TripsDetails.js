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
const TripsDetialsPage = ({ onLoginClick, ctaAction, handleIsLoading }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [locationData, setLocationData] = useState(null);
    const [TripsData, setTripsData] = useState(null);
    const [hotelIds, setHotelids] = useState([]);
    const [placesToVisit, setPlacesToVisit] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { tripId } = useParams();
    const [pageType, setPageType] = useState(null);
    const [tripData, setTripData] = useState(null);
    const [otherPeopleGoing, setOtherPeopleGoing] = useState([]);
    const extractTextFromHTML = (htmlString) => {
        if (!htmlString) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        return doc.body.textContent || "";
    };
    const EnrollInTrip = async (type) => {
        // type == 2 if see others people going in trip
        // else null
        // console.log("EnrollInTrip called with type:", type);
        if (type == 2) {
            console.log("See others people going in trip");
            console.log("otherPeopleGoing", otherPeopleGoing);

            return;
        }
        // Check if user is logged in and profile is complete
        const user = JSON.parse(localStorage.getItem("user"));
        const userToken = localStorage.getItem("userToken"); // Assuming this is where the token is stored

        if (user && user?.profileCompleted !== undefined && user.profileCompleted === true && userToken) {
            const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/enroll/${tripId}`;
            // console.log('Fetching from:', url);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`, // Send token for authentication
                    },
                    body: JSON.stringify({ userId: user._id }), // Send userId in the body
                });

                const data = await response.json();
                if (response.ok) {
                    // console.log('Successfully enrolled in trip:', data);
                    setOtherPeopleGoing(data.updatedTrip); // Assuming the API returns this data
                    // Optionally update local user state or notify user
                    alert('You have successfully enrolled in the trip!');
                } else {
                    console.error('Enrollment failed:', data.message);
                    alert(data.message || 'Failed to enroll in the trip.');
                }
            } catch (error) {
                console.error('Error enrolling in trip:', error);
                alert('An error occurred while enrolling. Please try again.');
            }
        } else {
            // console.log('User not logged in or profile incomplete');
            onLoginClick(); // Trigger login popup
        }
    };

    const getRandomNumberReviews = () => {
        return Math.floor(Math.random() * 100) + 1;
    };
    const setLocationDetailsFromLocationId = (locationId) => {
        const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/${locationId}`;
        // console.log('Fetching from:', url);
        fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })


            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch location: ${response.statusText}`);
                }
                return response.json();
            })
            .then((location) => {
                // console.log('Raw API response:', location);
                location.title = location?.title?.replace(/[0-9. ]/g, '');
                location.title = extractTextFromHTML(location.title);
                setHotelids(location?.hotels);
                if (!location) {
                    throw new Error('Location data is empty or null');
                }
                setLocationData(location);
                // console.log('Setting locationData state:', location);
            })
            .catch((err) => {
                console.error('Fetch error:', err.message);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
                // handleIsLoading(false);
            });
    };

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
        const url = window.location.href;
        // console.log("URL:", url);
        // console.log("Current URL:", url);

        if (url.includes("/trips/")) {
            setPageType(PageTypeEnum.TRIP);
        } else if (url.includes("/location/")) {
            setPageType(PageTypeEnum.LOCATION);
        }
        // console.log("Page Type:", pageType);
    }, []); // only run once when the component mounts
    // Fetch location details
    useEffect(() => {
        const fetchTripDetails = async () => {
            // console.log('Starting fetch for tripId:', tripId);
            // handleIsLoading(true);
            setLoading(true);

            try {
                const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/${tripId}`;
                // console.log('Fetching from:', url);

                const TripResponse = await fetch(url, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                // console.log('Response status:', TripResponse.status);
                setTripData(TripResponse);

                if (!TripResponse.ok) {
                    throw new Error(`Failed to fetch location: ${TripResponse.statusText}`);
                }

                const Trip = await TripResponse.json();
                // console.log('Raw API response:', Trip);
                Trip.title = Trip?.title?.replace(/[0-9. ]/g, '');
                Trip.title = extractTextFromHTML(Trip.title);
                setTitle(Trip.title);
                setDescription(Trip.description);
                setTripsData(Trip);
                const locationId = Trip.locationId;
                // console.log("Location ID:", locationId);
                setLocationDetailsFromLocationId(locationId);

            } catch (err) {
                console.error('Fetch error:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
                // handleIsLoading(false);
            }
        };

        fetchTripDetails();
    }, [tripId]);
    // Log locationData when it updates
    // useEffect(() => {
    //     console.log("useEffect triggered with locationData:", locationData);
    //     if (locationData) {
    //         console.log('locationData updated:', locationData);
    //     } else {
    //         console.log('locationData is still null');
    //     }
    // }, [locationData]);


    if (!locationData) {
        return <p>Loading...</p>; // Or any placeholder UI
    }
    else {
        // console.log("locationData:", locationData);
    }

    // Render when data is loaded
    return (
        <div className="DestinationPage">
            <LocationEventsDetails
                type="Explore"
                location={title || 'Unknown Location'}
                title={title || 'Destination'}
                rating={locationData?.rating || 'N/A'}
                country={locationData?.country || 'India'}
            />
            <LocationImageGallery locationImages={locationData?.photos} />

            {isMobile && <AddLocationCard pageType={pageType} onLoginClick={onLoginClick} EnrollInTrip={EnrollInTrip} PeopleGoingInTrip={otherPeopleGoing} btnsStyle={{ width: "100%" }} style={{ marginBottom: "50px", marginLeft: "0px" }} ctaAction={ctaAction} title={title} rating={locationData?.rating} reviews={getRandomNumberReviews()} bestTime={TripsData?.essentials.bestTime} placesToVisit={locationData?.placesNumberToVisit || "10"} HotelsToStay={locationData?.hotels?.length || "10"} MainImage={locationData?.images[0]} />}

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? "col-lg-8" : "col-lg-12"}>
                    <Discription pageType={pageType} shortDescription={TripsData?.itinerary || ""} fullDescription={TripsData?.itinerary || ""} bestTime={TripsData?.essentials.bestTime} />
                    <PlacesToVisitSection title={title} placesIds={locationData?.placesToVisit} ctaAction={ctaAction} />
                    <PlanTripDates onLoginClick={onLoginClick} EnrollInTrip={EnrollInTrip} pageType={pageType} ctaAction={ctaAction} startDatePreTrip={TripsData?.essentials?.timeline?.fromDate} endDatePreTrip={TripsData?.essentials?.timeline?.tillDate} />
                    <LocationMapSection latitude={locationData?.fullDetails?.coordinates?.lat} longitude={locationData?.fullDetails?.coordinates?.long} />
                    <HotelsAndStaysSection hotelIds={hotelIds} />
                </div>

                {!isMobile && (
                    <div className="col-lg-4">
                        <div
                            style={{
                                position: 'sticky',
                                top: '10px',
                                zIndex: 50, // ensure it's above other content if needed
                            }}
                        >
                            <AddLocationCard
                                pageType={pageType}
                                EnrollInTrip={EnrollInTrip}
                                onLoginClick={onLoginClick}
                                PeopleGoingInTrip={otherPeopleGoing}
                                ctaAction={ctaAction}
                                title={title}
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

export default TripsDetialsPage;