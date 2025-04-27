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
import ProfileCardUi from '../../components/Profile/ProfileCard.js'; // Import the new component
import { extractTextFromHTML } from '../../utils/htmlRelatedServices.js'; // adjust path as needed
import { PageTypeEnum } from '../../utils/pageType'; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import { getLocationById } from '../../utils/CommonServices.js';
import { ProfileCardEnum } from '../../utils/EnumClasses.js';
import toast from 'react-hot-toast';
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
    const navigate = useNavigate();

    const EnrollInTrip = async () => {

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
                    console.log('Successfully enrolled in trip:', data);
                    // setOtherPeopleGoing(data.trip); // Assuming the API returns this data

                    toast.success('You have successfully enrolled in the trip!');
                    navigate(`/trips/en/${tripId}`); // Redirect to the trip details page
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
        const fetchTripDetails = async () => {

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

                const TripRes = await TripResponse.json();
                const Trip = TripRes.trip;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const fromDate = new Date(Trip.essentials.timeline.fromDate);
                setTripStatus(fromDate < today || Trip.requirements.status === 'completed' ? 'completed' : Trip.requirements.status);
                // console.log('Raw API response:', Trip);
                Trip.title = Trip?.title?.replace(/[0-9.]/g, '');
                Trip.title = extractTextFromHTML(Trip.title);
                setTripsData(Trip);
                setotherGoing(TripRes.appliedUsers);
                fetchLocationDetails(Trip.locationId);
            } catch (err) {
                console.error('Fetch error:', err.message);
            } finally {
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
                type="Trip"
                location={locationData?.title || 'Unknown Location'}
                title={TripsData.title || 'Destination'}
                rating={locationData?.rating || 'N/A'}
                country={locationData?.country || 'India'}
            />
            <LocationImageGallery locationImages={locationData?.photos} />

            {isMobile && <AddLocationCard showBtns={TripStatus && TripStatus === "completed" ? false : true} pageType={pageType} onLoginClick={onLoginClick} EnrollInTrip={EnrollInTrip} btnsStyle={{ width: "100%" }} style={{ marginBottom: "50px", marginLeft: "0px" }} title={TripsData.title} rating={locationData?.rating} reviews={getRandomNumberReviews()} bestTime={TripsData?.essentials.bestTime} placesToVisit={locationData?.placesNumberToVisit || "10"} HotelsToStay={locationData?.hotels?.length || "10"} MainImage={locationData?.images[0]} />}

            <div className="row" style={{ position: 'relative' }}>
                <div className={!isMobile ? "col-lg-8" : "col-lg-12"}>
                    {otherGoing.length > 0 ? (
                        <div>
                            <h2 className="section-title">All Other Going</h2>
                            <div className="user-list">
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
                    <Discription pageType={pageType} shortDescription={TripsData?.itinerary || ""} fullDescription={TripsData?.itinerary || ""} bestTime={TripsData?.essentials.bestTime} />
                    <PlacesToVisitSection title={TripsData.title} placesIds={locationData?.placesToVisit} ctaAction={ctaAction} />
                    {TripStatus && TripStatus !== "completed" && <PlanTripDates onLoginClick={onLoginClick} EnrollInTrip={EnrollInTrip} pageType={pageType} ctaAction={ctaAction} startDatePreTrip={TripsData?.essentials?.timeline?.fromDate} endDatePreTrip={TripsData?.essentials?.timeline?.tillDate} />}
                    <LocationMapSection latitude={locationData?.fullDetails?.coordinates?.lat} longitude={locationData?.fullDetails?.coordinates?.long} />
                    <HotelsAndStaysSection hotelIds={TripsData.selectedHotelId ? TripsData.selectedHotelId : hotelIds} />
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
                                showBtns={TripStatus && TripStatus === "completed" ? false : true}
                                pageType={pageType}
                                EnrollInTrip={EnrollInTrip}
                                onLoginClick={onLoginClick}
                                ctaAction={ctaAction}
                                title={TripsData.title}
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
        </div >
    );
};

export default TripsDetialsPage;