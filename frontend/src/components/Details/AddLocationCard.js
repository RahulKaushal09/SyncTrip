import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLeaf, faBars, faPlane } from '@fortawesome/free-solid-svg-icons';
import '../../styles/AddLocationCard.css';
// import locations from "../../data/locations.json"
import { FaLeaf, FaBars, FaPlane } from "react-icons/fa";
// improt enum class 
import { PageTypeEnum } from '../../utils/pageType';  // adjust path as needed
const AddLocationCard = ({ showBtns, pageType, onLoginClick, EnrollInTrip, btnsStyle, style, ctaAction, title, address, rating, reviews, bestTime, placesToVisit, HotelsToStay, MainImage }) => {
    const [activeIcon, setActiveIcon] = useState(0);
    const [btn2Text, setBtn2Text] = useState("");
    const [btn2CTA, setBtn2CTA] = useState(() => ctaAction);

    // const [showItinearyBtn, setShowItinearyBtn] = useState(true);
    // create enum for page type location or trips

    // get random numebr 10 to 100 
    const getRandomNumberReviews = Math.floor(Math.random() * (100 - 10 + 1)) + 10;
    const accommodationTexts = [
        `<strong style='color:black'>${placesToVisit}</strong>+ Places to visit`,
        `<strong style='color:black'>${HotelsToStay}</strong>+ Hotels to stay at`,
        `<strong style='color:black'>${getRandomNumberReviews}</strong>+ Others planning`
    ];
    const [currentText, setCurrentText] = useState(0);

    useEffect(() => {
        if (pageType == PageTypeEnum.LOCATION) {
            setBtn2CTA(() => ctaAction);
        } else if (pageType == PageTypeEnum.TRIP) {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user && user?.profileCompleted != undefined && user?.profileCompleted == true) {
                setBtn2CTA(() => EnrollInTrip);
            }
            else {
                setBtn2CTA(() => onLoginClick);
            }
        } else {
            setBtn2CTA(() => ctaAction);
        }
    }, [pageType, ctaAction]);
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIcon((prev) => (prev + 1) % 3);
            setCurrentText((prev) => (prev + 1) % accommodationTexts.length);
        }, 2000); // Changes every 2 seconds

        return () => clearInterval(interval);
    }, []);
    useEffect(() => {
        if (pageType == PageTypeEnum.LOCATION) {
            setBtn2Text("Create a Trip →");
        } else if (pageType == PageTypeEnum.TRIP) {
            setBtn2Text("Join Trip");
        } else {
            setBtn2Text("Create a Trip →");
        }
    }, [pageType]);





    return (
        <div className="travel-card" style={style}>
            <div className="location-card-header ">
                <div className='d-flex row text-start'>
                    <div className="location-card-title text-start">
                        <h4>{title}</h4>
                        {address && <p className='text-muted' style={{ fontSize: "14px" }}>{address}</p>}
                        <div className='d-flex reviewingBox'>
                            <div className=" info-box">★ {rating}</div>
                            <div className=" info-box">{reviews} reviews</div>
                        </div>
                        <p className="trip-info ">{bestTime}</p>
                        <div className="location-card-icons">
                            <FaLeaf
                                className='locationIcons'
                                style={{
                                    backgroundColor: activeIcon === 0 ? 'black' : 'transparent',
                                    color: activeIcon === 0 ? 'white' : 'inherit',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                            <FaBars
                                className='locationIcons'
                                style={{
                                    backgroundColor: activeIcon === 1 ? 'black' : 'transparent',
                                    color: activeIcon === 1 ? 'white' : 'inherit',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                            <FaPlane
                                className='locationIcons'
                                style={{
                                    backgroundColor: activeIcon === 2 ? 'black' : 'transparent',
                                    color: activeIcon === 2 ? 'white' : 'inherit',
                                    padding: '5px',
                                    borderRadius: '50%',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>

                        {/* <div className="location-card-icons">
                        <FaLeaf className='locationIcons' />
                        <FaBars className='locationIcons' />
                        <FaPlane className='locationIcons' />
                    </div>
                    <div className="location-card-accommodation">
                        <p>{placesToVisit}+ Places to stay</p>
                    </div> */}
                    </div>
                    <div className="location-card-accommodation">
                        <p style={{
                            transition: 'opacity 0.3s ease',
                            opacity: 0.7
                        }}>
                            <span dangerouslySetInnerHTML={{ __html: accommodationTexts[currentText] }} />
                            {/* {accommodationTexts[currentText]} */}
                        </p>
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
            {showBtns &&
                <div className="location-card-buttons">
                    {pageType == PageTypeEnum.LOCATION && <button className="btn btn-white" onClick={ctaAction} style={btnsStyle}>Explore itinerary</button>}
                    <button
                        className="btn btn-black"
                        onClick={btn2CTA}
                        style={btnsStyle}
                    >
                        {btn2Text}
                    </button>
                </div>
            }
        </div>
    );
};

export default AddLocationCard;