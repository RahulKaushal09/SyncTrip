import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FiSearch } from "react-icons/fi";
import "../../styles/SearchBar.css";

const SearchBar = ({ label }) => {
    const [destination, setDestination] = useState("");
    return (
        <div className="">
            <div className="input-group dateBlock" >
                <span className="d-flex align-items-center me-2" ><FiSearch style={{ color: "#1E1E1E", scale: "1.3" }} /></span>
                <input
                    type="text"
                    placeholder="Search destinations, hotels"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="searchBarInput"
                />
            </div>
        </div>
    );
};

export default SearchBar;
