import React, { useState, useEffect } from 'react';
import "../../styles/trips/tripCard.css";
import tripsHeaderImg from "../../assets/images/TripsHeader.png";

import '../../styles/LocationCard.css'; // Optional: You can create a CSS file for styling
import { CiHeart } from "react-icons/ci";
import { Carousel } from 'react-bootstrap';
import { FaRupeeSign } from 'react-icons/fa';
const TripCard = ({ trip, activeTab }) => {
  const {
    _id,
    title,
    MainImageUrl,
    tripRating,
    essentials: {
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
  // console.log(trip);
  const [urlToTrip, setUrlToTrip] = useState("/trips/" + _id);
  useEffect(() => {

    // console.log(activeTab);
    switch (activeTab) {
      case 'upcoming':
        setUrlToTrip(`/trips/${_id}`);
        break;
      case 'enrolled':
        setUrlToTrip(`/trips/en/${_id}`);
        break;
      case 'history':
        setUrlToTrip(`/trips/${_id}`);
        break;
      default:
        setUrlToTrip(`/trips/${_id}`);
        break;
    }
  }, [activeTab]);

  var include = ""
  if (includeTravel && includeFood && includeHotel) {
    include = "Hotel, Food & Travel"
  } else if (includeTravel && includeFood) {
    include = "Hotel & Travel"
  }
  else if (includeTravel && includeHotel) {
    include = "Hotel & Food"
  }
  else if (includeFood && includeHotel) {
    include = "Food & Travel"
  }
  else if (includeTravel) {
    include = "Travel"
  }
  else if (includeFood) {
    include = "Food"
  }
  else if (includeHotel) {
    include = "Hotel"
  }
  else {
    include = "None"
  }

  // Format dates for display
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : 'N/A';

  const availableSpots = 5;

  return (
    <div className="location-card">
      <div className="card-image">
        <Carousel
          interval={null} // Disable auto-play
          controls={false} // Show navigation arrows
          indicators={false} // Show indicators
          wrap={true} // Allow wrapping
        >
          <Carousel.Item key={1} onClick={() => window.location.href = `${urlToTrip}`} style={{ cursor: "pointer" }}>
            <img
              className="d-block"
              src={MainImageUrl}
              alt={`${title} Landscape`}
              style={{ objectFit: 'cover' }}
            />
          </Carousel.Item>
        </Carousel>
        <CiHeart className="heart-icon" />
      </div>
      <div className="card-content" onClick={() => window.location.href = `${urlToTrip}`} style={{ cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className='tripCard-heading-font'>{title}</h3>
          <div className="rating">
            <span style={{ display: "flex", alignItems: "center" }}><FaRupeeSign style={{ width: "8px", marginRight: "5px" }} />  {price}</span>
          </div>
        </div>
        <div className="trip-details">
          <p className='dayNights-font'>{duration}</p>
          <p className='otherDetails-font'>Dates: {formatDate(fromDate)} - {formatDate(tillDate)}</p>
          <p className='otherDetails-font'>Price: {price}</p>
          <p className='otherDetails-font'>Available Spots: <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{availableSpots} Left</span></p>
          <p className='otherDetails-font'>Includes: <span style={{ color: '#28a745' }}>{include} included</span></p>
          <p className='otherDetails-font'>Age: <span >{age}+</span></p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
