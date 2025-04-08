// Footer.js
import React from 'react';
import "../../styles/Footer.css"; // Optional: Custom CSS for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGooglePlay, faApple } from '@fortawesome/free-brands-svg-icons';
import SyncTripLogo from "../../assets/images/logoWeb.png";
const Footer = ({ links }) => {
    // Default links if none are provided via props
    const defaultLinks = {
        company: [
            { name: 'About', url: '/about' },
            { name: 'How It Works', url: '/how-it-works' },
            { name: 'Blog', url: '/blog' },
        ],
        contact: [
            { name: 'Help Center', url: '/help-center' },
            { name: 'Press', url: '/press' },
            { name: 'FAQs', url: '/faqs' },
        ],
        more: [
            { name: 'Hotels', url: '/hotels' },
            { name: 'Itinerary', url: '/itinerary' },
            { name: 'Low Fare Tips', url: '/low-fare-tips' },
        ],
    };

    // Use provided links or default links
    const companyLinks = links?.company || defaultLinks.company;
    const contactLinks = links?.contact || defaultLinks.contact;
    const moreLinks = links?.more || defaultLinks.more;

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    {/* <h3 className="footer-title" style={{ fontSize: "40px", fontWeight: "700" }}>Synctrip</h3> */}
                    <img src={SyncTripLogo} style={{ width: "30%", marginBottom: "50px" }} alt="SyncTrip Logo" className="footer-logo" />
                    <p className='footerTextColorNormal'>Plan together, travel smarter—sync your perfect trip in minutes.</p>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Company</h3>
                    <ul className="footer-nav-list">
                        {companyLinks.map((link, index) => (
                            <li key={index} className="footer-nav-item">
                                <a className='footerTextColorNormal' href={link.url}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">Contact</h3>
                    <ul className="footer-nav-list">
                        {contactLinks.map((link, index) => (
                            <li key={index} className="footer-nav-item">
                                <a className='footerTextColorNormal' href={link.url}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-section">
                    <h3 className="footer-title">More</h3>
                    <ul className="footer-nav-list">
                        {moreLinks.map((link, index) => (
                            <li key={index} className="footer-nav-item">
                                <a className='footerTextColorNormal' href={link.url}>{link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="footer-section">
                    <div className="social-icons">
                        <a href="https://facebook.com" className="social-icon">
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="https://instagram.com" className="social-icon">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://twitter.com" className="social-icon">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                    </div>
                    <h3 className="footerTextColorNormal" style={{ fontSize: "1.55rem" }}>Discover our app</h3>
                    <div className="app-buttons">
                        <div className='buttonGetApp'  >
                            <FontAwesomeIcon icon={faGooglePlay} style={{ scale: "1.3", marginRight: "10px" }} />
                            {/* <a href="https://play.google.com" className="app-button"> */}
                            <p style={{ marginBottom: "0px" }}>Get it on Google Play</p>
                        </div>
                        {/* </a> */}
                        <div className='buttonGetApp'  >
                            <FontAwesomeIcon icon={faApple} style={{ scale: "1.9", marginRight: "10px" }} />
                            {/* <a href="https://apple.com" className="app-button"> */}
                            <p style={{ marginBottom: "0px" }}>Available on the App Store</p>
                        </div>
                        {/* </a> */}
                    </div>
                </div>
            </div>
            <p className="copyright">© 2025 Synctrip. All rights reserved.</p>
        </footer >
    );
};

export default Footer;