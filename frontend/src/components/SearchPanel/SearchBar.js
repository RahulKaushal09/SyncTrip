import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import { FiSearch } from "react-icons/fi";
import "../../styles/SearchBar.css";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const [placeholder, setPlaceholder] = useState("Search destinations, hotels");

    useEffect(() => {
        const updatePlaceholder = () => {
            if (window.innerWidth <= 768) {
                // Mobile view: Alternate placeholder
                setPlaceholder("Search destinations...");
                const interval = setInterval(() => {
                    setPlaceholder((prev) =>
                        prev === "Search destinations..." ? "Search hotels..." : "Search destinations..."
                    );
                }, 4000); // Switch every 2 seconds
                return () => clearInterval(interval); // Cleanup interval
            } else {
                // Desktop view: Full placeholder
                setPlaceholder("Search destinations, hotels");
            }
        };

        // Run on mount and window resize
        updatePlaceholder();
        window.addEventListener("resize", updatePlaceholder);
        return () => window.removeEventListener("resize", updatePlaceholder);
    }, []);
    // const [destination, setDestination] = useState("");
    return (
        <div className="">
            <div className="input-group-searchBar dateBlock" >
                <span className="d-flex align-items-center me-2" ><FiSearch style={{ color: "#1E1E1E", scale: "1.1" }} /></span>
                <input
                    type="text"
                    placeholder={placeholder}//"Search destinations, hotels"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm in parent
                    className="searchBarInput"
                />
            </div>
        </div>
    );
};

export default SearchBar;
