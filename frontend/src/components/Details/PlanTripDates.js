import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/PlanTripDates.css'; // Optional: for custom styling
import { TbBackground } from 'react-icons/tb';
import { PageTypeEnum } from '../../utils/pageType';

const TripPlanner = ({ pageType, onLoginClick, EnrollInTrip, ctaAction, startDatePreTrip, endDatePreTrip }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [btn2CTA, setBtn2CTA] = useState(() => ctaAction);

    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 1);

    useEffect(() => {
        if (pageType == PageTypeEnum.LOCATION) {
            setBtn2CTA(() => ctaAction);
        } else if (pageType == PageTypeEnum.TRIP) {
            var user = JSON.parse(localStorage.getItem("user"));
            if (user && user?.profileCompleted !== undefined && user?.profileCompleted == true) {
                setBtn2CTA(() => () => EnrollInTrip(1)); //recheck this logic, it seems to always enroll in trip with id 1
            }
            else {
                setBtn2CTA(() => onLoginClick);
            }
        } else {
            setBtn2CTA(() => ctaAction);
        }
    }, [pageType, ctaAction]);
    useEffect(() => {
        if (startDatePreTrip && endDatePreTrip) {
            setStartDate(new Date(startDatePreTrip));
            setEndDate(new Date(endDatePreTrip));

        }
    }, [startDatePreTrip, endDatePreTrip]);
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
                    <strong>Let's plan your trip{' '}</strong>

                </h2>
                {pageType !== PageTypeEnum.TRIP &&
                    <button className="clear-dates" onClick={clearDates}>
                        Clear Dates
                    </button>}
            </div>
            <div className="date-range">
                {startDate && endDate
                    ? `${startDate.toDateString()} - ${endDate.toDateString()}`
                    : 'Select dates'}
            </div>
            <div className="calendar-container" >
                <DatePicker

                    selected={startDate}
                    onChange={pageType !== PageTypeEnum.TRIP ? handleDateChange : () => { }}


                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    minDate={today} // Dynamically set to today
                    maxDate={maxDate} // Dynamically set to one year from today
                    monthsShown={2}
                    onMonthChange={(date) => setSelectedMonth(date)}
                    readOnly={pageType === PageTypeEnum.TRIP ? true : false}
                />
            </div>
            <div className="button-container row">
                {pageType && pageType == PageTypeEnum.LOCATION && <div className=' col-lg-6 col-md-12 col-sm-12 zeroPaddingInMobile-btn-1000'>
                    <button className="btn btn-black create-itinerary " style={{ width: "100%" }} onClick={ctaAction}>
                        Use Synctrip Itinerary
                    </button>
                </div>
                }
                <div className={`${pageType === PageTypeEnum.TRIP ? "col-lg-12" : "col-lg-6"} col-md-12 col-sm-12 zeroPaddingInMobile-btn-1000`}>
                    <button className="view-more-btn create-trip " style={{ borderRadius: " 9px", width: "100%" }} onClick={ctaAction}>
                        {pageType && pageType == PageTypeEnum.LOCATION ? "Create Trip" : "Join Trip"}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default TripPlanner;