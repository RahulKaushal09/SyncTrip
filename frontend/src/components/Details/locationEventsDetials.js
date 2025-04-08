import React, { useState } from "react";
import { Card, Button } from 'react-bootstrap';
import "../../styles/LocationEventsDetails.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { GrUploadOption } from "react-icons/gr";
import { FaShare } from "react-icons/fa";

const LocationEventsDetails = ({ type, location, name, rating, country, title, address }) => {
    const url = "";
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    return (
        <div className="locationEventsDetails">
            <div style={{ display: "flex", justifyContent: "space-between" }} >
                {/* <p className="text-muted">Home /{type} /<strong>{location}</strong></p> */}
                <h2 className="locationEventHeadings">{title}</h2>
                {address && <p>{address} Address Here</p>}
                <div className="d-flex m-gap-2 justify-content-between" style={{ alignItems: "center" }}>
                    <div style={{ display: "flex" }} >
                        <div className=" btn-light-blue circlularButton" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon icon={faStar} style={{ marginRight: "10px" }} />
                            {rating}</div>
                        {!isMobile && <div className=" btn-light-blue circlularButton" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: "10px" }} />
                            {country}
                        </div>}
                    </div>
                    <div className="d-flex align-items-center">
                        {!isMobile && <div variant="primary" className="">Share</div>}
                        <FaShare style={{ marginLeft: "10px" }} />

                    </div>
                </div>
            </div>
        </div>
    );
};
export default LocationEventsDetails;
