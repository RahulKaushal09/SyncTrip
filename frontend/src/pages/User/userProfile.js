import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/User/userProfile.css';
import { isTodayGreaterThanWithGivenDate } from '../../utils/CommonServices';


const UserProfile = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [canEdit, setCanEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                    },
                });
                const data = await response.json();
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                setUserData(data.user);
                setCanEdit(data.canEdit);
                setFormData({
                    name: data.user.name,
                    travelGoal: data.user.travelGoal || '',
                    socialMedias: data.user.socialMedias || { instagram: '', facebook: '', twitter: '' },
                    languages: data.user.languages || [],
                    persona: data.user.persona || [],
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [userId]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('socialMedias.')) {
            const socialKey = name.split('.')[1];
            setFormData({
                ...formData,
                socialMedias: { ...formData.socialMedias, [socialKey]: value },
            });
        } else if (name === 'languages' || name === 'persona') {
            setFormData({
                ...formData,
                [name]: value.split(',').map(item => item.trim()),
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.error) {
                console.error(data.error);
                return;
            }
            setUserData({ ...userData, ...formData });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    // Carousel navigation
    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === userData.profile_picture.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? userData.profile_picture.length - 1 : prev - 1
        );
    };

    if (!userData) return <div className="profile-loading">Loading...</div>;
    const currentTrips = userData.trips.filter(trip => !isTodayGreaterThanWithGivenDate(trip.essentials.timeline.fromDate));
    const pastTrips = userData.trips.filter(trip => isTodayGreaterThanWithGivenDate(trip.essentials.timeline.fromDate));

    return (
        <div className="profile-container">
            <div className="profile-hero">
                <div className="profile-carousel">
                    {userData.profile_picture.length > 0 ? (
                        <>
                            <img
                                src={userData.profile_picture[currentImageIndex] || 'https://via.placeholder.com/300'}
                                alt="Profile"
                                className="profile-hero-image"
                            />
                            {userData.profile_picture.length > 1 && (
                                <div className="profile-carousel-controls">
                                    <button className="profile-carousel-btn" onClick={prevImage}>←</button>
                                    <button className="profile-carousel-btn" onClick={nextImage}>→</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <img
                            src="https://via.placeholder.com/300"
                            alt="Profile"
                            className="profile-hero-image"
                        />
                    )}
                </div>
                <h1 className="profile-name">{userData.name}</h1>
                {userData.travelGoal && (
                    <p className="profile-goal">{userData.travelGoal}</p>
                )}
                <div className="profile-stats-page">
                    <span>Rating: {userData.rating}/5</span>
                    <span>Profile Views: {userData.viewCount}</span>
                    {userData.profileCompleted && (
                        <span className="profile-badge-complete">Profile Complete</span>
                    )}
                </div>
                {canEdit && (
                    <button
                        className="profile-btn-primary"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                )}
            </div>

            {isEditing && canEdit && (
                <div className="profile-edit-form">
                    <h2>Edit Profile</h2>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Travel Goal:</label>
                        <input
                            type="text"
                            name="travelGoal"
                            value={formData.travelGoal}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Languages (comma-separated):</label>
                        <input
                            type="text"
                            name="languages"
                            value={formData.languages.join(', ')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Persona (comma-separated):</label>
                        <input
                            type="text"
                            name="persona"
                            value={formData.persona.join(', ')}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Instagram:</label>
                        <input
                            type="text"
                            name="socialMedias.instagram"
                            value={formData.socialMedias.instagram}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Facebook:</label>
                        <input
                            type="text"
                            name="socialMedias.facebook"
                            value={formData.socialMedias.facebook}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Twitter:</label>
                        <input
                            type="text"
                            name="socialMedias.twitter"
                            value={formData.socialMedias.twitter}
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className="profile-btn-primary" onClick={handleSubmit}>
                        Save Changes
                    </button>
                </div>
            )}

            <div className="profile-info-page">
                {canEdit && userData.email && (
                    <div className="profile-info-item">Email: {userData.email}</div>
                )}
                {canEdit && userData.phone && (
                    <div className="profile-info-item">Phone: {userData.phone}</div>
                )}
                {userData.sex && <div className="profile-info-item">Sex: {userData.sex}</div>}
                {userData.dateOfBirth && (
                    <div className="profile-info-item">
                        Age: {Math.floor((new Date() - new Date(userData.dateOfBirth)) / (1000 * 60 * 60 * 24 * 365))}
                    </div>
                )}
                {userData.languages.length > 0 && (
                    <div className="profile-info-item">
                        Languages: {userData.languages.map(lang => (
                            <span key={lang} className="profile-badge">{lang}</span>
                        ))}
                    </div>
                )}
                {userData.persona.length > 0 && (
                    <div className="profile-info-item">
                        Persona: {userData.persona.map(p => (
                            <span key={p} className="profile-badge">{p}</span>
                        ))}
                    </div>
                )}
                {(userData.socialMedias.instagram || userData.socialMedias.facebook || userData.socialMedias.twitter) && (
                    <div className="profile-social-links">
                        {userData.socialMedias.instagram && (
                            <a href={`https://www.instagram.com/` + userData.socialMedias.instagram.replace("@", "")} target="_blank" rel="noopener noreferrer">Instagram</a>
                        )}
                        {userData.socialMedias.facebook && (
                            <a href={userData.socialMedias.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
                        )}
                        {userData.socialMedias.twitter && (
                            <a href={userData.socialMedias.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>
                        )}
                    </div>
                )}
            </div>

            <div className="profile-trips-section">
                <h2 className="profile-trips-title">Current Trips</h2>
                {currentTrips.length > 0 ? (
                    <div className="row tripCardRowScrollable">
                        {currentTrips.map(trip => (
                            <div key={trip._id} className="col-md-4 col-sm-6 mb-4">
                                <div className="profile-trip-card">
                                    <img
                                        src={trip.MainImageUrl || 'https://via.placeholder.com/400x200'}
                                        alt={trip.title}
                                        className="profile-trip-image"
                                    />
                                    <div className="profile-trip-name">{trip.title}</div>
                                    <button style={{ marginBottom: "40px" }} className=" btn btn-white">Explore Itinerary</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="profile-empty-state">
                        <p>No current trips. Start exploring new adventures!</p>
                        <button className="btn btn-black" onClick={() => window.location.href = "/trips"} >Find Trips</button>
                    </div>
                )}
            </div>

            <div className="profile-trips-section">
                <h2 className="profile-trips-title">Past Trips</h2>
                {pastTrips.length > 0 ? (
                    <div className="row tripCardRowScrollable">
                        {pastTrips.map(trip => (
                            <div key={trip._id} className="col-md-4 col-sm-6 mb-4">
                                <div className="profile-trip-card">
                                    <img
                                        src={trip.MainImageUrl || 'https://via.placeholder.com/400x200'}
                                        alt={trip.title}
                                        className="profile-trip-image"
                                    />
                                    <div className="profile-trip-name">{trip.title}</div>
                                    <button style={{ marginBottom: "40px" }} className="btn btn-white">View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="profile-empty-state">
                        <p>No past trips. Plan your next journey!</p>
                        <button onClick={() => window.location.href = "/home"} className="btn btn-black">Explore Destinations</button>
                    </div>
                )}
            </div>

            {userData.preferred_destinations.length > 0 && (
                <div className="profile-trips-section">
                    <h2 className="profile-trips-title">Preferred Destinations</h2>
                    <div className="row">
                        {userData.preferred_destinations.map(dest => (
                            <div key={dest._id} className="col-md-4 col-sm-6 mb-4">
                                <div className="profile-trip-card">
                                    <img
                                        src={dest.photos[0] || 'https://via.placeholder.com/400x200'}
                                        alt={dest.title}
                                        className="profile-trip-image"
                                    />
                                    <div className="profile-trip-name">{dest.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {userData.wishlist.length > 0 && (
                <div className="profile-trips-section">
                    <h2 className="profile-trips-title">Wishlist</h2>
                    <div className="row">
                        {userData.wishlist.map(dest => (
                            <div key={dest._id} className="col-md-4 col-sm-6 mb-4">
                                <div className="profile-trip-card">
                                    <img
                                        src={dest.photos[0] || 'https://via.placeholder.com/400x200'}
                                        alt={dest.title}
                                        className="profile-trip-image"
                                    />
                                    <div className="profile-trip-name">{dest.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;