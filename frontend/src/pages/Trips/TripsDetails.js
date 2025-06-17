import React, { useState, useEffect, useRef } from 'react';
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
import { staticTripData } from "../../data/staticTripData.js"; // adjust the path accordingly

import ProfileCardUi from '../../components/Profile/ProfileCard.js'; // Import the new component
import { extractTextFromHTML } from '../../utils/htmlRelatedServices.js'; // adjust path as needed
import { PageTypeEnum } from '../../utils/pageType'; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import { getLocationById } from '../../utils/CommonServices.js';
import { ProfileCardEnum } from '../../utils/EnumClasses.js';
import { getFormattedStringFromDate } from '../../utils/CommonServices.js';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader/loader.js';
import { metaTags } from '../../seoData/metaTags.js';
import { Helmet } from "react-helmet-async";
import { tripDataSchema } from '../../seoData/seoSchemas.js';
import ItineraryComponent from '../../components/Trips/ItinearyBlockComponent.js';
const TripsDetialsPage = ({ onLoginClick, ctaAction, handleIsLoading }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [TripsData, setTripsData] = useState(null);
    const [otherGoing, setotherGoing] = useState([]);
    const [hotelIds, setHotelids] = useState([]);
    const { tripId } = useParams();
    const [pageType, setPageType] = useState(null);
    const [tripData, setTripData] = useState(null);
    const [TripStatus, setTripStatus] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const joinTripButtonRef = useRef(null);

    const EnrollInTrip = async (slotId) => {
        // Check if user is logged in and profile is complete
        // const user = JSON.parse(localStorage.getItem("user"));
        setUser(JSON.parse(localStorage.getItem("user")));
        const userToken = localStorage.getItem("userToken"); // Assuming this is where the token is stored
        if (!slotId) {
            toast.error('Please select a trip date slot');
            return;
        }
        if (alreadyEnrolled) {
            toast.success("You are already enrolled in this trip.");
            navigate(`/trips/en/${tripId}`); // Redirect to the trip details page
            return;
        }
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
                    body: JSON.stringify({ userId: user._id, slotId: parseInt(slotId) }),
                });

                const data = await response.json();
                if (response.ok) {
                    // setOtherPeopleGoing(data.trip); // Assuming the API returns this data

                    toast.success('You have successfully enrolled in the trip!');
                    navigate(`/trips/en/${tripId}`); // Redirect to the trip details page
                    // Fire Meta Pixel conversion event
                    if (window.fbq) {
                        window.fbq('trackCustom', 'JoinTrip');
                    }
                } else {
                    console.error('Enrollment failed:', data.message);
                    toast.error(data.message || 'Failed to enroll in the trip.');
                }
            } catch (error) {
                console.error('Error enrolling in trip:', error);
                toast.error('An error occurred while enrolling. Please try again.');
            }
        } else {
            // console.log('User not logged in or profile incomplete');
            onLoginClick(); // Trigger login popup

        }
    };

    const getRandomNumberReviews = () => {
        return Math.floor(Math.random() * 100) + 1;
    };
    const fetchLocationDetails = async (locationId) => {
        if (!locationId) return;
        try {
            const location = await getLocationById(locationId);

            if (location) {
                location.title = location?.title?.replace(/[0-9.]/g, '');
                location.title = extractTextFromHTML(location.title);
                setHotelids(location?.hotels);
                if (!location) {
                    throw new Error('Location data is empty or null');
                }
                setLocationData(location);
            } else {
                throw new Error("Location not found");
            }
        } catch (err) {
        }
    };
    const fetchTripDetails = async () => {
        setIsLoading(true);

        // Check for static trip data
        const staticTrip = staticTripData.find(t => t.TripId === tripId);
        if (staticTrip) {
            try {
                // Immediately render with static data
                const TripRes = staticTrip.TripData;
                const Trip = TripRes.trip;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                var fromDate;
                var endDate;
                for (let i = 0; i < Trip.essentials.timelines.length; i++) {
                    const timeline = Trip.essentials.timelines[i];

                    const from = timeline.fromDate ? new Date(timeline.fromDate) : new Date();
                    const till = timeline.tillDate ? new Date(timeline.tillDate) : new Date();

                    if (from > fromDate) fromDate = from;
                    if (till > endDate) endDate = till;
                }
                // const fromDate = new Date(Trip.essentials.timeline.fromDate);
                // const fromDate = Trip.essentials.timelines?.[0]?.fromDate ? new Date(Trip.essentials.timelines[0].fromDate) : new Date();
                // Set trip status
                setTripStatus(fromDate < today || Trip.requirements.status === 'completed'
                    ? 'completed'
                    : Trip.requirements.status
                );

                // Clean and set trip title
                Trip.title = Trip?.title?.replace(/[0-9.]/g, '');
                Trip.title = extractTextFromHTML(Trip.title);
                setTripsData(Trip);

                // Set applied users
                setotherGoing(TripRes.appliedUsers);
                if (user?._id) {
                    setAlreadyEnrolled(TripRes.appliedUsers.map(u => u._id).includes(user._id));
                }

                // Set location data
                const location = staticTrip.locationData;
                if (location) {
                    location.title = location?.title?.replace(/[0-9.]/g, '');
                    location.title = extractTextFromHTML(location.title);
                    setHotelids(location?.hotels);
                    setLocationData(location);
                } else {
                    throw new Error('Location data is empty or null');
                }

                // Background backend fetch to update data
                const updateBackendData = async () => {
                    try {
                        const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/${tripId}`;
                        const TripResponse = await fetch(url, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (!TripResponse.ok) {
                            throw new Error(`Failed to fetch trip: ${TripResponse.statusText}`);
                        }

                        const TripRes = await TripResponse.json();
                        const UpdatedTrip = TripRes.trip;

                        // Update staticTripData
                        staticTrip.TripData = {
                            trip: {
                                ...staticTrip.TripData.trip,
                                ...UpdatedTrip,
                                title: extractTextFromHTML(
                                    UpdatedTrip.title?.replace(/[0-9.]/g, '')
                                )
                            },
                            appliedUsers: TripRes.appliedUsers
                        };

                        // Update UI with fresh data
                        setTripsData(staticTrip.TripData.trip);
                        setotherGoing(TripRes.appliedUsers);
                        if (user?._id) {
                            setAlreadyEnrolled(TripRes.appliedUsers.map(u => u._id).includes(user._id));
                        }

                        // Fetch and update location data
                        if (UpdatedTrip.locationId) {
                            const location = await getLocationById(UpdatedTrip.locationId);
                            if (location) {
                                location.title = location?.title?.replace(/[0-9.]/g, '');
                                location.title = extractTextFromHTML(location.title);
                                staticTrip.locationData = location;
                                setLocationData(location);
                                setHotelids(location?.hotels);
                            }
                        }

                    } catch (err) {
                        console.error('Background backend fetch failed:', err);
                    }
                };

                // Run background update
                updateBackendData();
                setIsLoading(false);
                return;

            } catch (err) {
                console.error('Error processing static trip data:', err);
            }
        }

        // No static data found, fetch directly from backend
        try {
            const url = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/${tripId}`;
            const TripResponse = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!TripResponse.ok) {
                throw new Error(`Failed to fetch trip: ${TripResponse.statusText}`);
            }

            const TripRes = await TripResponse.json();
            const Trip = TripRes.trip;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            var fromDate;
            var endDate;
            // const fromDate = new Date(Trip.essentials.timeline.fromDate);
            // if (TripRes.appliedUsers && TripRes.appliedUsers.length > 0) {
            //     var currentUser = TripRes.appliedUsers.find(u => u._id === user?._id);
            //     if (currentUser && currentUser.slotId) {
            //         Trip.essentials.timelines = []
            //         fromDate = new Date(currentUser.startDate);
            //         endDate = new Date(currentUser.endDate);
            //         Trip.essentials.timelines.push({
            //             slotId: currentUser.slotId,
            //             fromDate: currentUser.startDate,
            //             tillDate: currentUser.endDate
            //         });

            //     }
            // } else {



            for (let i = 0; i < Trip.essentials.timelines.length; i++) {
                const timeline = Trip.essentials.timelines[i];

                const from = timeline.fromDate ? new Date(timeline.fromDate) : new Date();
                const till = timeline.tillDate ? new Date(timeline.tillDate) : new Date();

                if (from > fromDate) fromDate = from;
                if (till > endDate) endDate = till;
            }
            // }
            // const fromDate = Trip.essentials.timelines?.[0]?.fromDate ? new Date(Trip.essentials.timelines[0].fromDate) : new Date();
            // Set trip status
            setTripStatus(fromDate < today || Trip.requirements.status === 'completed'
                ? 'completed'
                : Trip.requirements.status
            );

            // Clean and set trip title
            Trip.title = Trip?.title?.replace(/[0-9.]/g, '');
            Trip.title = extractTextFromHTML(Trip.title);
            setTripsData(Trip);

            // Set applied users
            setotherGoing(TripRes.appliedUsers);
            if (user?._id) {
                setAlreadyEnrolled(TripRes.appliedUsers.map(u => u._id).includes(user._id));
            }

            // Fetch location data
            if (Trip.locationId) {
                const location = await getLocationById(Trip.locationId);
                if (location) {
                    location.title = location?.title?.replace(/[0-9.]/g, '');
                    location.title = extractTextFromHTML(location.title);
                    setLocationData(location);
                    setHotelids(location?.hotels);
                } else {
                    throw new Error('Location not found');
                }
            }

        } catch (err) {
            console.error('Backend fetch error:', err.message);
        } finally {
            setIsLoading(false);
        }
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

        if (url.includes("/trips/")) {
            setPageType(PageTypeEnum.TRIP);
        } else if (url.includes("/location/")) {
            setPageType(PageTypeEnum.LOCATION);
        }
    }, []); // only run once when the component mounts
    // Fetch location details
    useEffect(() => {
        fetchTripDetails();
    }, [tripId]);
    // Separate effect for scrolling
    useEffect(() => {
        if (!isLoading && joinTripButtonRef.current) {
            joinTripButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (!isLoading) {
            console.warn('Join trip button not found');
            // Optional retry with querySelector as fallback
            const joinTripButton = document.querySelector('.location-card-buttons');
            if (joinTripButton) {
                joinTripButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                console.error('Join trip button still not found in DOM');
            }
        }
    }, [isLoading]);

    if (isLoading || !TripsData || !locationData) {
        return (
            <div className="loader-container">
                <Helmet>
                    <title>Join Group Trip – SyncTrip</title>
                    <meta
                        name="description"
                        content="Join exciting group trips with SyncTrip. Explore destinations and meet new travelers."
                    />
                </Helmet>
                <Loader setLoadingState={isLoading} TextToShow="Loading Trip Details" />
            </div>
        );
    }

    const meta = metaTags.tripDetails(TripsData, locationData);
    // Render when data is loaded
    return (

        <div className="DestinationPage">
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />
                <link rel="canonical" href={`https://synctrip.in/trips/${tripId}`} />

                {/* Open Graph */}
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.ogImage} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://synctrip.in/trips/${tripId}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />
                <meta name="twitter:image" content={meta.ogImage} />

                {/* JSON-LD */}
                <script type="application/ld+json">{JSON.stringify(tripDataSchema(TripsData, locationData))}</script>
            </Helmet>
            <LocationEventsDetails
                type="Trip"
                location={locationData?.title || 'Unknown Location'}
                title={TripsData.title || 'Destination'}
                rating={locationData?.rating || 'N/A'}
                country={locationData?.country || 'India'}
            />
            <LocationImageGallery locationImages={locationData?.photos} locationName={TripsData.title} />

            {isMobile && <AddLocationCard
                btnReference={joinTripButtonRef}
                showBtns={TripStatus && TripStatus === "completed" ? false : true}
                pageType={pageType}
                onLoginClick={onLoginClick}
                EnrollInTrip={EnrollInTrip}
                btnsStyle={{ width: "100%" }}
                style={{ marginBottom: "50px", marginLeft: "0px" }}
                title={TripsData.title} rating={locationData?.rating}
                reviews={getRandomNumberReviews()}
                timelines={TripsData?.essentials?.timelines}
                // bestTime={TripsData?.essentials?.timeline.fromDate ? (getFormattedStringFromDate(TripsData?.essentials?.timeline.fromDate) + " - " + getFormattedStringFromDate(TripsData?.essentials?.timeline.tillDate)) : TripsData?.essentials?.bestTime}
                placesToVisit={locationData?.placesNumberToVisit || "10"}
                HotelsToStay={locationData?.hotels?.length || "10"}
                MainImage={locationData?.images[0]}
                alreadyEnrolled={alreadyEnrolled}
                price={TripsData?.essentials?.price} />
            }

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? "col-lg-8" : "col-lg-12"}>
                    <ItineraryComponent itinerary={TripsData?.itinerary} />

                    {/* <Discription pageType={pageType} shortDescription={TripsData?.itinerary || ""} fullDescription={TripsData?.itinerary || ""} bestTime={TripsData?.essentials.bestTime} /> */}
                    <PlacesToVisitSection title={TripsData.title} placesIds={locationData?.placesToVisit} ctaAction={ctaAction} />
                    {(TripsData.selectedHotelId.length > 0 || hotelIds.length > 0) && <HotelsAndStaysSection hotelIds={TripsData.selectedHotelId.length > 0 ? TripsData.selectedHotelId : hotelIds} locationName={TripsData.title} />}
                    {/* {TripStatus && TripStatus !== "completed" && <PlanTripDates onLoginClick={onLoginClick} EnrollInTrip={EnrollInTrip} pageType={pageType} ctaAction={ctaAction} startDatePreTrip={TripsData?.essentials?.timeline?.fromDate} endDatePreTrip={TripsData?.essentials?.timeline?.tillDate} />} */}
                    {otherGoing.length > 0 ? (
                        <div>
                            <h2 className="section-title">All Other Going</h2>
                            <div className="user-list-detailsContaier">
                                {otherGoing.map((user) => {
                                    // const isConnected = user.status === 0;
                                    // const hasSentRequest = user.status === 1;
                                    // const hasRecievedRequest = user.status === -1;
                                    // const noInteraction = user.status === null;

                                    // let btns = [];

                                    // if (isConnected) {
                                    //     btns = [{ text: 'Chat', onClick: () => viewChat(user._id), className: 'chat btn btn-black' }];
                                    // } else if (hasSentRequest) {
                                    //     btns = [{ text: 'Requested', onClick: () => { }, className: 'requested disabled', inlineStyle: { pointerEvents: 'none' } }];
                                    // } else if (noInteraction) {
                                    //     btns = [{ text: 'Send Request', onClick: () => sendRequest(user._id), className: 'send-request' }];
                                    // }
                                    // else if (hasRecievedRequest) {
                                    //     btns = [{ text: 'Accept', onClick: () => acceptRequest(user._id), className: 'accept', inlineStyle: { width: "100%" } }];
                                    // }

                                    return (
                                        <ProfileCardUi
                                            profileCardInlineStyle={{ display: "block" }}
                                            key={user._id}
                                            user={user}
                                            // btns={btns}
                                            // onViewProfile={viewProfile}
                                            // hasSentRequest={hasSentRequest}
                                            // isConnected={isConnected}
                                            // hasRecievedRequest={hasRecievedRequest}
                                            type={ProfileCardEnum.AllGoing}
                                            showviewProfile={false}
                                        />
                                    );
                                })}
                            </div>

                        </div>
                    ) : ("")}
                    <LocationMapSection latitude={locationData?.fullDetails?.coordinates?.lat} longitude={locationData?.fullDetails?.coordinates?.long} />


                </div>

                {!isMobile && (
                    <div className="col-lg-4" style={{ marginBottom: "17px" }}>
                        <div
                            style={{
                                position: 'sticky',
                                top: '10px',
                                zIndex: 50, // ensure it's above other content if needed
                            }}
                        >
                            <AddLocationCard
                                alreadyEnrolled={alreadyEnrolled}
                                showBtns={TripStatus && TripStatus === "completed" ? false : true}
                                pageType={pageType}
                                EnrollInTrip={EnrollInTrip}
                                onLoginClick={onLoginClick}
                                ctaAction={ctaAction}
                                title={TripsData.title}
                                rating={locationData?.rating}
                                reviews={getRandomNumberReviews()}
                                timelines={TripsData?.essentials?.timelines}
                                // bestTime={locationData?.best_time}
                                placesToVisit={locationData?.placesNumberToVisit || "10"}
                                HotelsToStay={locationData?.hotels?.length || "10"}
                                MainImage={locationData?.images[0]}
                                price={TripsData?.essentials?.price}
                            />
                        </div>
                    </div>
                )}
            </div>

            <SyncTripAppPushingSection showWork={false} ctaAction={ctaAction} />
        </div >
    );
};

export default TripsDetialsPage;