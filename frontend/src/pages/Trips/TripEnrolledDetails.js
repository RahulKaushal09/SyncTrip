import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/trips/EnrolledTripDetails.css'; // Adjusted path
import LocationEventsDetails from '../../components/Details/locationEventsDetials';
import LocationImageGallery from '../../components/Details/locationImages';
import DOMPurify from 'dompurify'; // For sanitizing itinerary HTML
import PlacesToVisitSection from '../../components/Details/PlacesToVisit';
import HotelsAndStaysSection from '../../components/Details/HotelSection';

const EnrolledTripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('userToken');
  const hasFetched = useRef(false);

  const extractTextFromHTML = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const fetchLocationDetails = async (locationId) => {
    if (!locationId) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/${locationId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Failed to fetch location: ${response.statusText}`);
      const location = await response.json();
      location.title = location?.title?.replace(/[0-9. ]/g, '');
      location.title = extractTextFromHTML(location.title);
      setLocationData(location);
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

      const parsedUser = JSON.parse(user);
      if (parsedUser.profileCompleted === false) {
        console.log('Profile incomplete, but proceeding');
      }

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
      } catch (err) {
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

  if (isLoading) {
    return <div className="status-message loading">Loading trip details...</div>;
  }

  if (error) {
    return <div className="status-message error">{error}</div>;
  }

  if (!trip) {
    return <div className="status-message">Trip not found</div>;
  }

  const pickupMapUrl = trip.essentials.pickup?.mapLocation
    ? `https://www.google.com/maps?q=${trip.essentials.pickup.mapLocation.lat},${trip.essentials.pickup.mapLocation.long}`
    : '#';
  const dropMapUrl = trip.essentials.dropPoint?.mapLocation
    ? `https://www.google.com/maps?q=${trip.essentials.dropPoint.mapLocation.lat},${trip.essentials.dropPoint.mapLocation.long}`
    : '#';

  return (
    <div className="enrolled-trip-details-container">
      {/* <header className="trip-header">
        <button className="btn-black back-button" onClick={() => navigate('/trips')}>
          Back to Enrolled Trips
        </button>
        <h1 className="enrolled-trip-title">{trip.title}</h1>
      </header>
      <section className="trip-hero">
        <img
          src={trip.MainImageUrl}
          alt={""}
          className="enrolled-trip-image"
        />
        <div className="trip-hero-overlay">
          <span className="people-count">{trip.numberOfPeopleApplied || 0} People Going</span>
        </div>
      </section> */}
      <section className="location-section">
        <LocationEventsDetails
          type="Explore"
          location={locationData?.title || trip.title || 'Unknown Location'}
          title={locationData?.title || trip.title || 'Destination'}
          rating={locationData?.rating || 'N/A'}
          country={locationData?.country || 'India'}
        />
        <LocationImageGallery locationImages={locationData?.photos || []} />
      </section>
      <section className="people-applied">
        <h2 className="section-title">Participants</h2>
        {trip.peopleApplied?.length > 0 ? (
          <div className="applied-users">
            {trip.peopleApplied.map((user) => (
              <div key={user._id} className="user-card" style={{ position: "relative", width: "200px", height: "200px", background: `url(${user.profilePicture})`, backgroundSize: "cover", borderRadius: "10px" }}>
                {/* <img
                  src={user.profilePicture}
                  alt={""}
                  className="user-profile-picture"
                /> */}
                <div className="user-info">
                  {user.name && user.age && (
                    <div className="profile-user-name" ><span>{user.name.split(" ")[0]}</span>, {user.age}</div>)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-users">No visible participants yet.</p>
        )
        }
      </section >
      <section className="trip-info-grid">
        <div className="trip-details">
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
        </div>
        <div className="trip-inclusions">
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
        <div className="trip-requirements">
          <h2 className="section-title">Requirements</h2>
          <div className="info-item">
            <strong>Status:</strong>{' '}
            <span className={`status-${trip.requirements.status?.toLowerCase()}`}>
              {trip.requirements.status || 'N/A'}
            </span>
          </div>
        </div>
      </section>
      <section className="trip-itinerary">
        <h2 className="section-title">Itinerary</h2>
        <div
          className="itinerary-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(trip.itinerary) }}
        />
      </section>
      <PlacesToVisitSection title={trip?.title} placesIds={locationData?.placesToVisit} />
      <HotelsAndStaysSection hotelIds={locationData?.hotels} />
    </div >
  );
};

export default EnrolledTripDetails;