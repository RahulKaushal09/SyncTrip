import React, { useState } from "react";
import DateSelector from './DateSelector';
import SearchBar from './SearchBar';
import SearchCircle from './SearchCircle';
import "../../styles/SearchBar.css";
const MainSearchBar = ({ searchTerm, setSearchTerm }) => {
    // const [destination, setDestination] = useState("");
    // const [checkin, setCheckin] = useState("");
    // const [checkout, setCheckout] = useState("");
    // const [guests, setGuests] = useState("1 room, 2 adults");
    // const [isCheckInDateSelectorVisible, setCheckInDateSelectorVisible] = useState(false);
    // const [isCheckOutDateSelectorVisible, setCheckOutDateSelectorVisible] = useState(false);
    // const searchHotels = () => {
    //     if (!destination || !checkin || !checkout) {
    //         alert("Please fill in all fields.");
    //         return;
    //     }
    //     alert(`Searching for hotels in ${destination} from ${checkin} to ${checkout} for ${guests}`);
    // };
    // const handleCheckInInputClick = () => {
    //     setCheckInDateSelectorVisible(true); // Show the DateSelector when input is clicked
    // };

    // const handleCheckInDateChange = (date) => {
    //     isCheckInDateSelectorVisible(date); // Set the selected date when the DateSelector is used
    //     setCheckInDateSelectorVisible(false); // Hide DateSelector after selecting a date
    // };
    // const handleCheckOutInputClick = () => {
    //     setCheckOutDateSelectorVisible(true); // Show the DateSelector when input is clicked
    // };

    // const handleCheckOutDateChange = (date) => {
    //     isCheckOutDateSelectorVisible(date); // Set the selected date when the DateSelector is used
    //     setCheckOutDateSelectorVisible(false); // Hide DateSelector after selecting a date
    // };
    return (
        <div className="search-container main-search-container" >
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {/* <DateSelector label="CheckIn"></DateSelector>
            <DateSelector label="CheckOut"></DateSelector> */}
            <SearchCircle></SearchCircle>
        </div>
    );
};


export default MainSearchBar;