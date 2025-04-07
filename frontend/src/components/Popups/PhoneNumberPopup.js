import React, { useState } from 'react';
import '../../styles/popups/phoneNumberPopup.css'; // New CSS file

export default function PhoneNumberPopup({ user, onClose, onPhoneSubmit }) {
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/google-complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id, phone }),
            });
            const data = await res.json();
            if (data?.user) {
                onPhoneSubmit(data.user); // Update user with phone number
                onClose();
            } else {
                alert(data?.message || 'Failed to save phone number');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="phone-number-overlay">
            <div className="phone-number-container">
                <button className="phone-number-close-btn" onClick={onClose}>
                    ×
                </button>
                <h2 className="phone-number-title">Add Your Phone Number</h2>
                <p style={{ marginBottom: "5px" }}>Please help us contact you.</p>
                <p className="phone-number-subtext" style={{ fontSize: "12px", color: "#ccc" }}>We promise not to call too often — just when it's important!</p>

                <form onSubmit={handleSubmit} className="phone-number-form">
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="phone-number-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <button type="submit" className="phone-number-submit-btn">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}