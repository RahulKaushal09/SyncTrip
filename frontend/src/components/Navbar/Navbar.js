import React, { useState, useEffect } from 'react';
import SyncTripLogo from "../../assets/images/logoWeb.png";
import { useLocation } from "react-router-dom";

import { Dropdown } from 'react-bootstrap';
import { PageTypeEnum } from '../../utils/pageType';
import "../../styles/navbar/navbar.css"; // Import your CSS file for styling
const Navbar = ({ ctaAction, onLoginClick, user }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [pageType, setPageType] = useState(null);
    const location = useLocation(); // Get the current location from react-router
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const closeDrawer = () => {
        setMobileNavOpen(false);
    };
    useEffect(() => {
        const path = location.pathname;

        if (path === `/${PageTypeEnum.TRIP}`) {
            setPageType(PageTypeEnum.TRIP);
        } else if (path === `/${PageTypeEnum.LOCATION}`) {
            setPageType(PageTypeEnum.LOCATION);
        } else {
            setPageType(PageTypeEnum.HOME);
        }
    }, [location.pathname]); // 👈 this will now update on route change

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    const handleLogout = () => {
        // You should clear user state in App.js
        localStorage.removeItem("user"); // Clear user data from local storage
        localStorage.removeItem("userToken"); // Clear access token from local storage
        localStorage.removeItem("accessToken"); // Clear access token from local storage
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
                    onClick={() => setMobileNavOpen(!mobileNavOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav" style={{ alignItems: "center" }}>
                        {pageType == PageTypeEnum.TRIP && <li className="nav-item" style={{ cursor: "pointer" }} onClick={ctaAction}>
                            <span className="nav-link">Create Trip</span>
                        </li>}
                        {pageType != PageTypeEnum.TRIP && <li className="nav-item" style={{ cursor: "pointer" }} onClick={() => window.location.href = "/trips"}>
                            <span className="nav-link">Trips</span>
                        </li>
                        }

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
            {mobileNavOpen && (
                <div className="mobile-overlay" onClick={closeDrawer}></div>
            )}

            {/* Mobile Drawer */}
            <div className={`mobile-drawer ${mobileNavOpen ? "open" : ""}`}>
                <div className='' style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
                    <div><a className="navbar-brand" href="/" style={{ display: 'inline-block', color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
                        <img src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%", }} />
                    </a>
                    </div>
                    <div className="drawer-header">
                        <span className="drawer-close" onClick={closeDrawer}>&times;</span>
                    </div>
                </div>
                <ul className="navbar-nav" style={{ alignItems: "flex-start", padding: "1rem" }}>
                    {pageType == PageTypeEnum.TRIP ? (
                        <li className="nav-item" onClick={() => { ctaAction(); closeDrawer(); }}>
                            <span className="nav-link">Create Trip</span>
                        </li>
                    ) : (
                        <li className="nav-item" onClick={() => { window.location.href = "/trips"; closeDrawer(); }}>
                            <span className="nav-link">Trips</span>
                        </li>
                    )}

                    <li className="nav-item dropdown">
                        {user ? (
                            <>
                                <img
                                    src={user?.profile_picture[0] || "https://via.placeholder.com/40"}
                                    alt="Profile"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                                <span className="ms-2 mt-2">{user?.name || "User"}</span>
                                <div className="mt-2">
                                    <a href="/profile" className="dropdown-item" onClick={closeDrawer}>Profile</a>
                                    <span className="dropdown-item" onClick={() => { handleLogout(); closeDrawer(); }}>Logout</span>
                                </div>
                            </>
                        ) : (
                            <button className="btn btn-black mt-2" onClick={() => { onLoginClick(); closeDrawer(); }}>
                                Login / Register
                            </button>
                        )}
                    </li>
                </ul>
            </div>
        </nav >
    );
};

export default Navbar;
