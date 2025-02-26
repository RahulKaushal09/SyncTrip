import React, { useState } from "react";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { CiCalendarDate } from "react-icons/ci";
import "../../styles/SearchBar.css";

const DateSelector = ({ label }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    return (
        <div className="">
            <div className="input-group dateBlock" >
                <span className="d-flex align-items-center" ><CiCalendarDate className="icon-date-picker" /></span>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="form-control custom-date-picker"
                    dateFormat="yyyy-MM-dd"
                    placeholderText={label}

                />
            </div>
        </div>
    );
};

export default DateSelector;
