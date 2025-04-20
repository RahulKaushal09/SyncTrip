import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/trips/EnrolledTripDetails.css';
import LocationEventsDetails from '../../components/Details/locationEventsDetials';
import LocationImageGallery from '../../components/Details/locationImages';
import DOMPurify from 'dompurify';
import PlacesToVisitSection from '../../components/Details/PlacesToVisit';
import HotelsAndStaysSection from '../../components/Details/HotelSection';
import ProfileCardUi from '../../components/Profile/ProfileCard.js'; // Import the new component
import { ProfileCardEnum } from '../../utils/EnumClasses.js';
import { getLocationById } from '../../utils/CommonServices.js';
import { extractTextFromHTML } from '../../utils/htmlRelatedServices.js'; // Adjust the import path as needed
import toast from 'react-hot-toast';
const EnrolledTripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('going');
  const [parsedUser, setParsedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('userToken');
  const hasFetched = useRef(false);
  const [otherGoing, setOtherGoing] = useState([]);
  const [requestsReceivedUsers, setRequestsReceivedUsers] = useState([]);
  const [connections, setConnections] = useState([]);




  const fetchLocationDetails = async (locationId) => {
    if (!locationId) return;
    try {
      const location = await getLocationById(locationId);

      if (location) {
        location.title = location?.title?.replace(/[0-9. ]/g, '');
        location.title = extractTextFromHTML(location.title);
        setLocationData(location);
      } else {
        throw new Error("Location not found");
      }
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    const fetchEnrolledTripDetails = async () => {
      if (!token || !user) {
        setError('Please log in to view trip details');
        navigate('/trips');
        return;
      }

      const userObj = JSON.parse(user);
      setParsedUser(userObj);
      setIsLoading(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/enrolled/${tripId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) throw new Error('Trip not found');
          if (response.status === 401) throw new Error('Unauthorized access');
          throw new Error('Failed to fetch trip details');
        }

        const data = await response.json();

        setTrip(data);
        fetchLocationDetails(data.locationId);

        // Categorize people based on status
        const allPeople = data.peopleApplied.filter(u => u._id !== userObj._id);

        const connections = allPeople.filter(u => u.status === 0); // Matched
        const requestsReceived = allPeople.filter(u => u.status === -1); // You received
        const requestsSent = allPeople.filter(u => u.status === 1); // You sent (optional)
        const noInteraction = allPeople.filter(u => u.status === null); // No interaction

        // Update relevant states
        setConnections(connections);
        setRequestsReceivedUsers(requestsReceived);
        setOtherGoing([...connections, ...requestsSent, ...requestsReceived, ...noInteraction]); // People going but not yet accepted
        // Optional: you could also maintain a `setRequestsSentUsers(requestsSent)` if needed

      } catch (err) {
        console.log('Error fetching trip details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchEnrolledTripDetails();
    }
  }, [tripId, token, navigate, user]);


  const apiCall = async (endpoint, method, data) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'API call failed');
    }

    return result;
  };

  // Send Request
  const sendRequest = async (receiverId) => {
    try {
      var result = await apiCall('/sendRequest', 'POST', { receiverId, tripId });
      toast.success(result.message || 'Request sent successfully!');
      window.location.reload(); // Reload the page to reflect changes

    } catch (err) {
      setError(err.message);
    }
  };

  // Accept Request
  const acceptRequest = async (requesterId) => {
    try {
      var result = await apiCall('/acceptRequest', 'POST', { requesterId, tripId });
      // UpdateUserLocalStorage(result.user);
      toast.success(result.message || 'Request accepted successfully!');
      window.location.reload(); // Reload the page to reflect changes
    } catch (err) {
      setError(err.message);
    }
  };

  // Reject Request
  // const rejectRequest = async (requesterId) => {
  //   try {
  //     await apiCall('/rejectRequest', 'POST', { requesterId, tripId });
  //     alert('Request rejected successfully!');
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // View Profile (placeholder)
  const viewProfile = (userId) => {
    console.log(`View profile of user ${userId}`);
    // Implement navigation to profile page
  };

  // View Chat (placeholder)
  const viewChat = (userId) => {
    console.log(`View chat with user ${userId} for trip ${tripId}`);
    // Implement navigation or chat opening logic here
  };
  if (isLoading) return <div className="status-message loading">Loading trip details...</div>;
  if (error) return <div className="status-message error">{error}</div>;
  if (!trip) return <div className="status-message">Trip not found</div>;

  const pickupMapUrl = trip.essentials.pickup?.mapLocation
    ? `https://www.google.com/maps?q=${trip.essentials.pickup.mapLocation.lat},${trip.essentials.pickup.mapLocation.long}`
    : '#';
  const dropMapUrl = trip.essentials.dropPoint?.mapLocation
    ? `https://www.google.com/maps?q=${trip.essentials.dropPoint.mapLocation.lat},${trip.essentials.dropPoint.mapLocation.long}`
    : '#';

  // Data for tabs




  return (
    <div className="enrolled-trip-details-container">

      <section className="location-section">
        <LocationEventsDetails
          type="Explore"
          location={locationData?.title || trip.title || 'Unknown Location'}
          title={locationData?.title || trip.title || 'Destination'}
          rating={locationData?.rating || 'N/A'}
          country={locationData?.country || 'India'}
        />
        {/* <div className="trip-hero-overlay">
          <span className="people-count">{trip.numberOfPeopleApplied || 0} People Going</span>
        </div> */}
        <LocationImageGallery locationImages={locationData?.photos || []} />
      </section>

      {/* Tabs Section */}
      <section className="tabs-section">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('going')}
            className={activeTab === 'going' ? 'active' : ''}
          >
            {!isMobile ? 'All Other Going' : 'Joining'}
            {otherGoing && otherGoing?.length > 0 ? <span className="numberOfRequests"> {otherGoing?.length}  </span> : ''}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={activeTab === 'requests' ? 'active' : ''}

          >
            Requests {!isMobile ? 'Received' : ''}{' '}

            {requestsReceivedUsers && requestsReceivedUsers?.length > 0 ? <span className="numberOfRequests"> {requestsReceivedUsers?.length}  </span> : ''}

          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={activeTab === 'connections' ? 'active' : ''}

          >
            Connections
            {connections && connections?.length > 0 ? <span className="numberOfRequests"> {connections?.length}  </span> : ''}

          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'going' && parsedUser && (
            <div>
              <h2 className="section-title">All Other Going</h2>
              {otherGoing.length > 0 ? (
                <div className="user-list">
                  {otherGoing.map((user) => {
                    const isConnected = user.status === 0;
                    const hasSentRequest = user.status === 1;
                    const hasRecievedRequest = user.status === -1;
                    const noInteraction = user.status === null;

                    let btns = [];

                    if (isConnected) {
                      btns = [{ text: 'Chat', onClick: () => viewChat(user._id), className: 'chat btn btn-black' }];
                    } else if (hasSentRequest) {
                      btns = [{ text: 'Requested', onClick: () => { }, className: 'requested disabled', inlineStyle: { pointerEvents: 'none' } }];
                    } else if (noInteraction) {
                      btns = [{ text: 'Send Request', onClick: () => sendRequest(user._id), className: 'send-request' }];
                    }
                    else if (hasRecievedRequest) {
                      btns = [{ text: 'Accept', onClick: () => acceptRequest(user._id), className: 'accept', inlineStyle: { width: "100%" } }];
                    }

                    return (
                      <ProfileCardUi
                        key={user._id}
                        user={user}
                        btns={btns}
                        onViewProfile={viewProfile}
                        hasSentRequest={hasSentRequest}
                        isConnected={isConnected}
                        hasRecievedRequest={hasRecievedRequest}
                        type={ProfileCardEnum.AllGoing}
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="no-users">No other people going yet.</p>
              )}
            </div>
          )}

          {activeTab === 'requests' && parsedUser && (
            <div>
              <h2 className="section-title">Requests Received</h2>
              {requestsReceivedUsers?.length > 0 ? (
                <div className="user-list">
                  {requestsReceivedUsers.map((user) => (
                    <ProfileCardUi
                      key={user._id}
                      user={user}
                      btns={[
                        { text: 'Accept', onClick: () => acceptRequest(user._id), className: 'accept', inlineStyle: { width: "100%" } },
                        // { text: 'Reject', onClick: () => rejectRequest(user._id), className: 'reject', inlineStyle: { width: "50%" } },
                      ]}
                      onViewProfile={viewProfile}
                      hasSentRequest={false}
                      type={ProfileCardEnum.RecivedRequests}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-users">No requests received yet.</p>
              )}
            </div>
          )}

          {activeTab === 'connections' && parsedUser && (
            <div>
              <h2 className="section-title">Connections</h2>
              {connections?.length > 0 ? (
                <div className="user-list">
                  {connections.map((user) => (
                    <ProfileCardUi
                      key={user._id}
                      user={user}
                      btns={[
                        { text: 'Chat', onClick: () => viewChat(user._id), className: 'chat btn btn-black', inlineStyle: { width: "100%" } },
                      ]}
                      onViewProfile={viewProfile}
                      hasSentRequest={false}
                      type={ProfileCardEnum.Connection}
                    />
                  ))}
                </div>
              ) : (
                <p className="no-users">No connections yet.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Trip Information */}
      <section className="trip-info">
        <div className="trip-info-grid">
          <div className="trip-details-card">
            <h2 className="section-title">Trip Details</h2>
            <div className="info-item">
              <strong>Region:</strong> {trip.essentials.region || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Duration:</strong> {trip.essentials.duration || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Price:</strong> ₹{trip.essentials.price?.toLocaleString() || 'N/A'}
            </div>
            <div className="info-item">
              <strong>Pickup:</strong>{' '}
              <a href={pickupMapUrl} target="_blank" rel="noopener noreferrer" className="map-link">
                {trip.essentials.pickup?.name || 'N/A'}
              </a>
            </div>
            <div className="info-item">
              <strong>Drop Point:</strong>{' '}
              <a href={dropMapUrl} target="_blank" rel="noopener noreferrer" className="map-link">
                {trip.essentials.dropPoint?.name || 'N/A'}
              </a>
            </div>
            <div className="info-item">
              <strong>Dates:</strong>{' '}
              {new Date(trip.essentials.timeline.fromDate).toLocaleDateString()} -{' '}
              {new Date(trip.essentials.timeline.tillDate).toLocaleDateString()}
            </div>
            <div className="info-item">
              <strong>Status:</strong>{' '}
              <span className={`status-${trip.requirements.status?.toLowerCase()}`}>
                {trip.requirements.status || 'N/A'}
              </span>
            </div>
          </div>
          <div className="trip-inclusions-card">
            <h2 className="section-title">Inclusions</h2>
            <div className="info-item">
              <strong>Travel:</strong> {trip.include.travel ? 'Included' : 'Not Included'}
            </div>
            <div className="info-item">
              <strong>Food:</strong> {trip.include.food ? 'Included' : 'Not Included'}
            </div>
            <div className="info-item">
              <strong>Hotel:</strong> {trip.include.hotel ? 'Included' : 'Not Included'}
            </div>
          </div>
          <div className="trip-requirements-card">
            <h2 className="section-title">Requirements</h2>

            <div className="info-item">
              <strong>Age :</strong>{' '}
              <span className={`age-${trip.requirements.age}`}>
                {trip.requirements.age || 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <strong>Fitness Criteria :</strong>{' '}
              <span className={`fitness-${trip.requirements.fitnessCriteria?.toLowerCase()}`}>
                {trip.requirements.fitnessCriteria || 'N/A'}
              </span>
            </div>
            <div className="info-item">
              <strong>Previous Experience:</strong>{' '}
              <span className={`experience-${trip.requirements.previousExp?.toLowerCase()}`}>
                {trip.requirements.previousExp || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <div className="trip-itinerary-card">
          <h2 className="section-title">Itinerary</h2>
          <div
            className="itinerary-content" style={{ textAlign: 'left' }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(trip.itinerary) }}
          />
        </div>
      </section>
      <PlacesToVisitSection title={trip?.title} placesIds={locationData?.placesToVisit} />
      <HotelsAndStaysSection hotelIds={locationData?.hotels} />
    </div>
  );
};

export default EnrolledTripDetails;