import React from 'react';
import "../../styles/trips/tripCard.css";
import tripsHeaderImg from "../../assets/images/TripsHeader.png";
const TripCard = ({ trip }) => {
  const {
    essentials: {
      region,
      duration,
      price,
      pickup,
      dropPoint,
      nearbyPoints,
    },
    include: { travel, food, hotel },
    itinerary,
  } = trip;

  // Split itinerary into an array for highlights (assuming itinerary is a string with bullet points or comma-separated)
  const itineraryHighlights = itinerary ? itinerary.split(',').slice(0, 3) : [];

  return (
    <div className="tripCard">
      {/* Background Image (you can replace with a dynamic image if available) */}
      <div className="tripCard-image" style={{ backgroundImage: `url(${tripsHeaderImg})` }}>
        <div className="tripCard-bookNow">Book Now @₹1</div>
      </div>

      {/* Trip Details */}
      <div className="tripCard-content">
        <div className="tripCard-header">
          <h2>{region} Retreat - Book Now Pay Later</h2>
          <span className="tripCard-duration">{duration}</span>
        </div>

        <div className="tripCard-inclusions">
          <div className="inclusion-item">
            <span>Intercity Car Transfers</span>
          </div>
          <div className="inclusion-item">
            <span>Airport Pick & Drop</span>
          </div>
          <div className="inclusion-item">
            <span>3 Activities</span>
          </div>
          <div className="inclusion-item">
            <span>Selected Meals</span>
          </div>
        </div>

        {/* Itinerary Highlights */}
        <div className="tripCard-highlights">
          {itineraryHighlights.map((highlight, index) => (
            <div key={index} className="highlight-item">
              <span>✔ {highlight.trim()}</span>
            </div>
          ))}
        </div>

        {/* Price Section */}
        <div className="tripCard-price">
          <span className="exclusive-offer">Exclusive Offers At Checkout</span>
          <div className="price-details">
            <span className="price-per-person">₹{price.toLocaleString()}/Person</span>
            <span className="total-price">Total Price ₹{(price * 2).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;