import React, { useState } from 'react';
import '../../styles/trips/Itinerary.css'; // Create this CSS file
import parse from 'html-react-parser';

const ItineraryComponent = ({ itinerary }) => {
    const [selectedDay, setSelectedDay] = useState(itinerary.days[0]?.dayTitle || '');

    const handleDayClick = (dayTitle) => {
        setSelectedDay(dayTitle);
    };

    const selectedDayData = itinerary.days.find(day => day.dayTitle === selectedDay);

    return (
        <div className="itinerary-container">
            {/* Top Section */}
            {itinerary.topSectionHtml && (
                <div className="top-section">
                    {parse(itinerary.topSectionHtml)}
                </div>
            )}
            <hr></hr>

            <h2>Day-Wise Itinerary</h2>
            {/* Day Filters */}
            <div className="day-filters">
                <div className='day-filters-child'>
                    {itinerary.days.map((day, index) => (
                        <button
                            key={index}
                            className={`day-button ${selectedDay === day.dayTitle ? 'active' : ''}`}
                            onClick={() => handleDayClick(day.dayTitle)}
                        >
                            {day.dayTitle}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day Content */}
            <div className="day-content">
                {selectedDayData ? parse(selectedDayData.htmlDescription) : <p>No data available for this day.</p>}
            </div>
            <hr></hr>
            {/* Bottom Section */}
            {itinerary.bottomSectionHtml && (
                <div className="bottom-section">
                    {parse(itinerary.bottomSectionHtml)}
                </div>
            )}
            <hr></hr>

        </div>
    );
};

export default ItineraryComponent;
