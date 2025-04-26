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
        sex: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); // Clear error on input change
    };

    const validateForm = () => {
        if (!form.email || !form.password) {
            setError('Email and password are required');
            return false;
        }
        if (isRegistering) {
            if (!form.name) {
                setError('Name is required for registration');
                return false;
            }
            if (!form.phone) {
                setError('Phone number is required for registration');
                return false;
            }
            if (form.phone.length < 10) {
                setError('Phone number must be at least 10 digits long');
                return false;
            }
            else if (form.phone.length > 10) {
                setError('Phone number must be at most 10 digits long');
                return false;
            }
        }
        return true;
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const endpoint = isRegistering
                ? `${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/basicRegistration`
                : `${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/login`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Operation failed');
            }

            if (data?.user) {
                if (data?.token) {
                    localStorage.setItem('userToken', data.token);
                }
                onLogin(data.user);
                onClose();
            } else {
                throw new Error(data?.message || 'No user data received');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/google-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || 'Google login failed');
            }

            if (data?.user) {
                if (data?.token) {
                    localStorage.setItem('userToken', data.token);
                }
                onLogin(data.user);
                onClose();
            } else {
                throw new Error('No user data received');
            }
        } catch (err) {
            setError(err.message || 'Google login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-popup-overlay">
            <div className="login-popup-container">
                <button
                    className="login-popup-close-btn"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    ×
                </button>
                <h2 className="login-popup-title">
                    {isRegistering ? 'Create an Account' : 'Welcome Back'}
                </h2>



                <form onSubmit={handleManualSubmit} className="login-popup-form">
                    {isRegistering && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="login-popup-input"
                                onChange={handleChange}
                                value={form.name}
                                disabled={isLoading}
                                required
                            />
                            <select
                                name="sex"
                                className="login-popup-input"
                                onChange={handleChange}
                                value={form.sex}
                                disabled={isLoading}
                            >
                                <option value="" disabled>Please select your gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                className="login-popup-input"
                                onChange={handleChange}
                                value={form.phone}
                                disabled={isLoading}
                                required
                            />
                        </>
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="login-popup-input"
                        onChange={handleChange}
                        value={form.email}
                        disabled={isLoading}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-popup-input"
                        onChange={handleChange}
                        value={form.password}
                        disabled={isLoading}
                        required
                    />
                    {error && <div className="login-popup-error" style={{ color: "red" }}>{error}</div>}
                    <button
                        type="submit"
                        className="login-popup-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Processing...'
                            : isRegistering
                                ? 'Create Account'
                                : 'Sign In'
                        }
                    </button>
                </form>

                <div className="login-popup-divider">OR</div>

                <div className="login-popup-google-container">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            setError('Google login failed. Please try again.');
                            setIsLoading(false);
                        }}
                        disabled={isLoading}
                    />
                </div>

                <p className="login-popup-toggle-text">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                            setForm({
                                name: '',
                                email: '',
                                phone: '',
                                password: '',
                                sex: '',
                            });
                        }}
                        className="login-popup-toggle-btn"
                        disabled={isLoading}
                    >
                        {isRegistering ? 'Sign In' : 'Create Account'}
                    </button>
                </p>
            </div>
        </div>
    );
}