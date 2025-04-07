import React, { useState } from 'react';
import '../../styles/preRegisterPopup.css';
import preRegisterPopupImg from '../../assets/images/preRegisterPopupImg.png';
const PreRegisterPopup = ({ onClose }) => {
    const [email, setEmail] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Email submitted:', email);
        onClose(); // Close the popup after submission
    };

    return (
        <div className="preRegister-popup-overlay">
            <div className="preRegister-popup-content">
                <button className="close-button-popUpEmail" onClick={onClose}>
                    ×
                </button>
                <div className="preRegister-popup-body">
                    <img
                        src={preRegisterPopupImg}// Replace with the actual image URL of the traveler
                        alt="Traveler"
                        className="preRegister-popup-image"
                    />
                    <div className="preRegister-popup-text">
                        <h2>Enjoying exploring your next adventure?</h2>
                        <p>
                            You can request beta access among the first to experience SyncTrip!
                        </p>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={handleEmailChange}
                            className="email-input"
                        />
                        <button className="submit-button" onClick={handleSubmit}>
                            Get Access
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreRegisterPopup;