import React from 'react';
import "../../styles/trips/tripCard.css";
import tripsHeaderImg from "../../assets/images/TripsHeader.png";

const TripCard = ({ trip, onClickFunction }) => {
  const {
    _id,
    title,
    locationId,
    MainImageUrl,
    itinerary,
    tripRating,
    essentials: {
      region,
      duration,
      bestTime,
      timeline: {
        fromDate,
        tillDate
      },
      altitude,
      typeOfTrip,
      price,
      season,
      pickup: {
        name: pickupName,
        mapLocation: {
          lat: pickupLat,
          long: pickupLong
        }
      },
      dropPoint: {
        name: dropPointName,
        mapLocation: {
          lat: dropPointLat,
          long: dropPointLong
        }
      },
    },
    requirements: {
      age,
      fitnessCriteria,
      status,
      previousExp
    },
    include: {
      travel: includeTravel,
      food: includeFood,
      hotel: includeHotel
    }
  } = trip;
  console.log(trip);

  // Format dates for display
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  return (
    <div className="tripCard" onClick={onClickFunction}>
      {/* Background Image */}
      <div className="tripCard-image" style={{ backgroundImage: `url(${MainImageUrl || tripsHeaderImg})` }}>
        <div className="tripCard-bookNow">Book Now @₹1</div>
      </div>

      {/* Trip Details */}
      <div className="tripCard-content">
        <div className="tripCard-header">
          <h2>{region}: {title}</h2>
          <span className="tripCard-duration">{duration || 'Flexible'}</span>
        </div>

        {/* Price Section */}
        <div className="tripCard-price">
          <span className="exclusive-offer">{season ? `Best in ${season}` : 'Exclusive Offers At Checkout'}</span>
          <div className="price-details">
            <span className="price-per-person">₹{price ? price.toLocaleString() : 'TBA'}/Person</span>
            <span className="total-price">Total Price ₹{price ? (price * 2).toLocaleString() : 'TBA'}</span>
          </div>
        </div>

        {/* Itinerary Highlights
        <div className="tripCard-highlights">
          {itinerary ? (
            <span style={{ color: "black" }} dangerouslySetInnerHTML={{ __html: itinerary.trim() }} />
          ) : (
            <span>No itinerary available</span>
          )}
        </div> */}

        {/* Inclusions and Additional Info */}
        <div className="tripCard-inclusions">
          <div className="inclusion-item">
            <span>{bestTime ? `Best Time: ${bestTime}` : 'Anytime'}</span>
          </div>
          <div className="inclusion-item">
            <span>
              {includeTravel ? 'Travel Included' : 'Pickup: ' + (pickupName || 'N/A')}
            </span>
          </div>
          <div className="inclusion-item">
            <span>
              {typeOfTrip ? `${typeOfTrip} Trip` : 'Drop: ' + (dropPointName || 'N/A')}
            </span>
          </div>
          <div className="inclusion-item">
            <span>
              {includeFood ? 'Meals Included' : 'Food Not Included'}
              {includeHotel ? ' + Hotel Stay' : ''}
            </span>
          </div>
        </div>

        {/* Additional Details (Optional) */}
        <div className="tripCard-footer" style={{ fontSize: '12px', color: '#666' }}>
          <span>From: {formatDate(fromDate)} - To: {formatDate(tillDate)}</span>
          {altitude && <span> | Altitude: {altitude} ft</span>}
          {tripRating && <span> | Rating: {tripRating}/5</span>}
          {age && <span> | Age: {age}+</span>}
          {fitnessCriteria && <span> | Fitness: {fitnessCriteria}</span>}
        </div>
      </div>
    </div>
  );
};

export default TripCard;