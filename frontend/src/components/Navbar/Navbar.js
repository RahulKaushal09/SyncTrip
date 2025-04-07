import React, { useState } from 'react';
import SyncTripLogo from "../../assets/images/logoWeb.png";
import { Dropdown } from 'react-bootstrap';

const Navbar = ({ ctaAction, onLoginClick, user }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLogout = () => {
        // You should clear user state in App.js
        localStorage.removeItem("user"); // Clear user data from local storage
        localStorage.removeItem("access_token"); // Clear access token from local storage
        window.location.reload(); // Simple refresh logout for now
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/" style={{ color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
                    <img src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%", marginLeft: "10px" }} />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav" style={{ alignItems: "center" }}>
                        <li className="nav-item" style={{ cursor: "pointer" }} onClick={ctaAction}>
                            <span className="nav-link">Create Trip</span>
                        </li>

                        <li className="nav-item dropdown" style={{ cursor: "pointer" }}>
                            {user ? (
                                <Dropdown show={showDropdown} onToggle={setShowDropdown}>
                                    <Dropdown.Toggle
                                        variant="link"
                                        style={{
                                            padding: 0,
                                            border: "none",
                                            background: "transparent",
                                            boxShadow: "none",
                                        }}
                                        onClick={toggleDropdown}
                                    >
                                        <img
                                            src={user?.profile_picture[0] || "https://via.placeholder.com/40"}
                                            alt={""}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        {/* username 
                                         */}
                                        <span className="ms-2" style={{ color: "black", fontSize: "16px", fontWeight: "500" }}>
                                            {user?.name || "User"}
                                        </span>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu align="end">
                                        <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <button className="btn btn-black ms-2" onClick={onLoginClick}>
                                    Login / Register
                                </button>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
