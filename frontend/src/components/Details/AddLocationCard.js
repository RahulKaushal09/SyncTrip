import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLeaf, faBars, faPlane } from '@fortawesome/free-solid-svg-icons';
import '../../styles/AddLocationCard.css';
import locations from "../../data/locations.json"
import { FaLeaf, FaBars, FaPlane } from "react-icons/fa";

const AddLocationCard = ({ ctaAction }) => {
    return (
        <div className="travel-card">
            <div className="location-card-header">
                <div className="location-card-title text-start">
                    <h4>Vrindavan </h4>
                    <p className='text-muted' style={{ fontSize: "14px" }}>- add address here</p>
                    <div className='d-flex '>
                        <div className=" info-box">★ 4.2</div>
                        <div className=" info-box">2 reviews</div>
                    </div>
                    <p className="trip-info ">14-29 June / 3 People</p>
                    <div className="location-card-icons">
                        <FaLeaf className='locationIcons' />
                        <FaBars className='locationIcons' />
                        <FaPlane className='locationIcons' />
                    </div>
                    <div className="location-card-accommodation">
                        <p>30+ Places to stay</p>
                    </div>
                </div>
                <div className="location-card-image">
                    <img src={locations[0].images[0]} alt="Prem Mandir, Vrindavan" />
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