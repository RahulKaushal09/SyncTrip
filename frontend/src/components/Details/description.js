import React, { useState } from 'react';
import '../../styles/Description.css'; // We'll create this CSS file separately
import { TiWeatherPartlySunny } from "react-icons/ti";
import { CiTimer } from "react-icons/ci";
import { MdSentimentVerySatisfied } from "react-icons/md";
import { TbTemperatureSun } from "react-icons/tb";
import location from "../../data/locations.json";
const Discription = ({ shortDescription, fullDescription, bestTime }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    // Shortened description for initial view
    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="travel-info-container">
            <div className="info-grid">
                <div className="essentials-section">
                    <h2 className='DescriptionHeading'>Essentials</h2>
                    <div className="essentials-item">
                        <TiWeatherPartlySunny className="icon" /> Weather: 32°C
                    </div>
                    <div className="essentials-item">
                        <CiTimer className="icon" /> Ideal duration: 5 days
                    </div>
                    <div className="essentials-item">
                        <MdSentimentVerySatisfied className="icon" /> Best time: {bestTime}
                    </div>
                </div>

                <div className="weather-section">
                    <h2 className='DescriptionHeading'>Upcoming weather</h2>
                    <div className="weather-item">
                        <TbTemperatureSun className="day-icon" /> Monday: 32°C
                    </div>
                    <div className="weather-item">
                        <TbTemperatureSun className="day-icon" /> Tuesday: 31°C
                    </div>
                    <div className="weather-item">
                        <TbTemperatureSun className="day-icon" /> Wednesday: 29°C
                    </div>
                </div>
            </div>

            <div className="description-section">
                <h2 className='DescriptionHeading'>Description</h2>
                <p
                    className="description-text"
                    dangerouslySetInnerHTML={{ __html: isExpanded ? fullDescription : shortDescription }}
                ></p>
                <button
                    className="view-more-btn"
                    onClick={toggleDescription}
                >
                    {isExpanded ? 'View Less' : 'View More'} →
                </button>
            </div>
            <hr></hr>
        </div>
    );
};

export default Discription;