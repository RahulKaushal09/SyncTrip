import React from "react";
import { Card, Button } from 'react-bootstrap';
import "../../styles/LocationEventsDetails.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { GrUploadOption } from "react-icons/gr";

const LocationEventsDetails = ({ type, location, name, rating, country, title, address }) => {
    const url = "";

    return (
        <div className="locationEventsDetails">
            <div >
                {/* <p className="text-muted">Home /{type} /<strong>{location}</strong></p> */}
                <h2 className="locationEventHeadings">{title}</h2>
                {address && <p>{address} Address Here</p>}
                <div className="d-flex m-gap-2 justify-content-between">
                    <div style={{ display: "flex" }} >
                        <div className=" btn-light-blue circlularButton" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon icon={faStar} style={{ marginRight: "10px" }} />
                            {rating}</div>
                        <div className=" btn-light-blue circlularButton" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: "10px" }} />
                            {country}
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div variant="primary" className="">Share</div>
                        <GrUploadOption style={{ marginLeft: "10px" }} />

                    </div>
                </div>
            </div>
        </div>
    );
};
export default LocationEventsDetails;
