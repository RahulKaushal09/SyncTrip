import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faBars, faPlane } from '@fortawesome/free-solid-svg-icons';
import '../../styles/AddLocationCard.css';
import locations from "../../data/locations.json"
const AddLocationCard = () => {
    return (
        <div className="travel-card">
            <div className="card-header">
                <div className="card-title">
                    <h2>Vrindavan - add address here</h2>
                    <p className="rating">★ 4.2 • 2 reviews</p>
                    <p className="trip-info">14-29 June / 3 People</p>
                    <div className="card-icons">
                        <FontAwesomeIcon icon={faLeaf} />
                        <FontAwesomeIcon icon={faBars} />
                        <FontAwesomeIcon icon={faPlane} />
                    </div>
                    <div className="card-accommodation">
                        <p>30+ Places to stay</p>
                    </div>
                </div>
                <div className="card-image">
                    <img src={locations[0].images[0]} alt="Prem Mandir, Vrindavan" />
                </div>
            </div>
            {/* <div className="card-icons">
                <FontAwesomeIcon icon={faLeaf} />
                <FontAwesomeIcon icon={faBars} />
                <FontAwesomeIcon icon={faPlane} />
            </div>
            <div className="card-accommodation">
                <p>30+ Places to stay</p>
            </div> */}
            <div className="card-buttons">
                <button className="explore-btn">Explore itinerary</button>
                <button className="create-trip-btn">Create a Trip →</button>
            </div>
        </div>
    );
};

export default AddLocationCard;