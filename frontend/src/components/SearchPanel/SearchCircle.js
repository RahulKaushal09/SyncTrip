import React from "react";
import { FiSearch } from "react-icons/fi";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/SearchBar.css";

const SearchCircle = () => {
    return (
        <div className="search-circle">
            <FiSearch className="search-icon" />
        </div>
    );
};

export default SearchCircle;
