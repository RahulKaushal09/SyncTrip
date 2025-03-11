import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/PlanTripDates.css'; // Optional: for custom styling
import { TbBackground } from 'react-icons/tb';

const TripPlanner = ({ ctaAction }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 1);
    // Handle date range selection
    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    // Clear selected dates
    const clearDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    // Create trip (placeholder action)
    const createTrip = () => {
        if (startDate && endDate) {
            alert(`Trip planned from ${startDate.toDateString()} to ${endDate.toDateString()}!`);
        } else {
            alert('Please select both start and end dates.');
        }
    };

    return (
        <div className="trip-planner">
            <div className='d-flex ' style={{ justifyContent: 'space-between', alignItems: 'start' }}>
                <h2 className='DescriptionHeading'>
                    Let's plan your trip{' '}

                </h2>
                <button className="clear-dates" onClick={clearDates}>
                    Clear Dates
                </button>
            </div>
            <div className="date-range">
                {startDate && endDate
                    ? `${startDate.toDateString()} - ${endDate.toDateString()}`
                    : 'Select dates'}
            </div>
            <div className="calendar-container" >
                <DatePicker

                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    minDate={today} // Dynamically set to today
                    maxDate={maxDate} // Dynamically set to one year from today
                    monthsShown={2}
                    onMonthChange={(date) => setSelectedMonth(date)

                    }
                />
            </div>
            <div className="button-container row">
                <div className='col-lg-6 col-md-12 col-sm-12 zeroPaddingInMobile-btn-1000'>
                    <button className="btn btn-black create-itinerary " style={{ width: "100%" }} onClick={ctaAction}>
                        Use Synctrip Itinerary
                    </button>
                </div>
                <div className='col-lg-6 col-md-12 col-sm-12 zeroPaddingInMobile-btn-1000'>
                    <button className="view-more-btn create-trip " style={{ borderRadius: " 9px", width: "100%" }} onClick={ctaAction}>
                        Create Trip
                    </button>
                </div>
            </div>
        </div >
    );
};

export default TripPlanner;