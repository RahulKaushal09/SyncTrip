import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLeaf, faBars, faPlane } from '@fortawesome/free-solid-svg-icons';
import '../../styles/AddLocationCard.css';
import locations from "../../data/locations.json"
import { FaLeaf, FaBars, FaPlane } from "react-icons/fa";

const AddLocationCard = ({ ctaAction, title, address, rating, reviews, bestTime, placesToVisit, MainImage }) => {
    return (
        <div className="travel-card">
            <div className="location-card-header">
                <div className="location-card-title text-start">
                    <h4>{title}</h4>
                    {address && <p className='text-muted' style={{ fontSize: "14px" }}>{address}</p>}
                    <div className='d-flex '>
                        <div className=" info-box">★ {rating}</div>
                        <div className=" info-box">{reviews} reviews</div>
                    </div>
                    <p className="trip-info ">{bestTime}</p>
                    <div className="location-card-icons">
                        <FaLeaf className='locationIcons' />
                        <FaBars className='locationIcons' />
                        <FaPlane className='locationIcons' />
                    </div>
                    <div className="location-card-accommodation">
                        <p>{placesToVisit}+ Places to stay</p>
                    </div>
                </div>
                <div className="location-card-image">
                    <img src={MainImage} alt="MainImage" />
                </div>
            </div>
            {/* <div className="location-card-icons">
                <FontAwesomeIcon icon={faLeaf} />
                <FontAwesomeIcon icon={faBars} />
                <FontAwesomeIcon icon={faPlane} />
            </div>
            <div className="location-card-accommodation">
                <p>30+ Places to stay</p>
            </div> */}
            <div className="location-card-buttons">
                <button className="btn btn-white" onClick={ctaAction}>Explore itinerary</button>
                <button className="btn btn-black" onClick={ctaAction}>Create a Trip →</button>
            </div>
        </div>
    );
};

export default AddLocationCard;