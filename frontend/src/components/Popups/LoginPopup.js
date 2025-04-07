import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import '../../styles/popups/loginPopup.css';

export default function LoginPopup({ onClose, onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        sex: 'Male',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        const endpoint = `${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/basicRegistration`; // Unified endpoint for both login and register
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data?.user) {
            if (data?.token) {
                localStorage.removeItem('userToken'); // Remove old token
                localStorage.setItem('userToken', data.token); // Store token if available
            }
            onLogin(data.user); // Pass user to App.js, triggers FullProfilePopup
            onClose();
        } else {
            alert(data?.message || 'Registration/Login failed');
        }
    };

    return (
        <div className="login-popup-overlay">
            <div className="login-popup-container">
                <button className="login-popup-close-btn" onClick={onClose}>
                    ×
                </button>
                <h2 className="login-popup-title">
                    {isRegistering ? 'Register' : 'Login'} to TripMate
                </h2>

                <form onSubmit={handleManualSubmit} className="login-popup-form">
                    {isRegistering && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className="login-popup-input"
                                onChange={handleChange}
                                value={form.name}
                            />
                            <select
                                name="sex"
                                className="login-popup-input"
                                onChange={handleChange}
                                value={form.sex}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="login-popup-input"
                        onChange={handleChange}
                        value={form.email}
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        className="login-popup-input"
                        onChange={handleChange}
                        value={form.phone}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-popup-input"
                        onChange={handleChange}
                        value={form.password}
                    />

                    <button type="submit" className="login-popup-submit-btn">
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>

                <div className="login-popup-divider">OR</div>

                <div className="login-popup-google-container">
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/google-login`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token: credentialResponse.credential }),
                            });
                            const data = await res.json();
                            if (data?.user) {
                                if (data?.token) {
                                    localStorage.removeItem('userToken'); // Remove old token
                                    localStorage.setItem('userToken', data.token); // Store token if available
                                }
                                onLogin(data.user); // Pass requiresPhone flag
                                onClose();
                            }
                        }}
                        onError={() => {
                            alert('Gmail login failed');
                        }}
                    />
                </div>

                <p className="login-popup-toggle-text">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="login-popup-toggle-btn"
                    >
                        {isRegistering ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}