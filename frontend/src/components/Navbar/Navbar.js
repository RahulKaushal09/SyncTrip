import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure to include Bootstrap CSS
import SyncTripLogo from "../../assets/images/logoWeb.png"
const Navbar = ({ ctaAction }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light ">
            <div className="container-fluid">
                {/* Logo/Brand */}
                <a className="navbar-brand" href="/" style={{ color: '#65CAD3', fontSize: "30px", fontWeight: "700", width: "100px" }}>
                    {/*  */}
                    <img src={SyncTripLogo} alt="SyncTrip" style={{ width: "100%", marginLeft: "10px" }} />
                </a>

                {/* Toggle button for mobile view */}
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

                {/* Navbar links */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item" style={{ cursor: "pointer" }} onClick={ctaAction}>
                            <a className="nav-link" >
                                Create Trip
                            </a>
                        </li>
                        <li className="nav-item" style={{ cursor: "pointer" }} onClick={ctaAction}>
                            <a className="nav-link" >
                                Sign Up
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;