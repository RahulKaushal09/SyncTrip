import React, { useState, useEffect } from 'react';
import '../../styles/popups/FullProfilePopup.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { fetchLocations } from '../../utils/CommonServices';
export default function FullProfilePopup({ user, onClose, onProfileComplete }) {
    const [form, setForm] = useState({
        travelStyles: [],
        travelerType: [],
        dreamDestinations: '',
        matchGender: 'Any',
        ageGroup: '',
        showProfile: true,
        allowInvites: true,
        wishlist: [],
        profilePicture: null,
        instagram: '',
        travelGoal: '',
        languages: '',
        dateOfBirth: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLocationIds, setSelectedLocationIds] = useState([]);
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        const getLocations = async () => {
            try {
                const res = await fetchLocations(0, 100);
                setLocations(res.locations || []);
            } catch (err) {
                console.error("Failed to fetch locations", err);
                setLocations([]); // fallback to empty array
            }
        };
        getLocations();
    }, []);
    // Modified handleChange to support button toggles
    const handleChange = (e, field, value) => {
        if (e) {
            const { name, value: inputValue, type, checked } = e.target;
            if (type === 'checkbox') {
                setForm((prev) => ({
                    ...prev,
                    [name]: checked
                        ? [...prev[name], inputValue]
                        : prev[name].filter((item) => item !== inputValue),
                }));
            } else if (type === 'file') {
                setForm((prev) => ({ ...prev, [name]: e.target.files[0] }));
            } else {
                setForm((prev) => ({ ...prev, [name]: inputValue }));
            }
        } else {
            // Handle button toggle for travelStyles and travelerType
            setForm((prev) => ({
                ...prev,
                [field]: prev[field].includes(value)
                    ? prev[field].filter((item) => item !== value)
                    : [...prev[field], value],
            }));
        }
    };

    const handleDestinationSelect = (dest) => {

        setSelectedLocationIds((prev) => {
            if (prev.includes(dest._id)) {
                return prev.filter((id) => id !== dest._id);
            } else {
                return [...prev, dest._id];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userId', user._id);
        Object.keys(form).forEach((key) => {
            if (key === 'profilePicture' && form[key]) {
                formData.append(key, form[key]);
            } else if (Array.isArray(form[key])) {
                formData.append(key, JSON.stringify(form[key]));
            } else {
                formData.append(key, form[key]);
            }
        });
        formData.append('preferredDestinations', JSON.stringify(selectedLocationIds));

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/complete-profile`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                onProfileComplete(data.user);
                onClose();
            } else {
                toast.error(data.message || 'Profile completion failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    const filteredLocations = locations.filter((dest) =>
        dest.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedTitles = locations
        .filter((loc) => selectedLocationIds.includes(loc._id))
        .map((loc) => loc.title);

    return (
        <div className="full-profile-overlay">
            <div className="full-profile-container">
                <button className="full-profile-close-btn" onClick={onClose}>
                    ×
                </button>
                <h2 className="full-profile-title">Complete Your Travel Profile</h2>
                <form onSubmit={handleSubmit} className="full-profile-form">
                    {/* Travel Style */}
                    <div className="full-profile-section">
                        <label>How do you like to travel?</label>
                        <div className="bubble-btn-container">
                            {[
                                'Backpacking',
                                'Beach vacations',
                                'Hill stations & adventure',
                                'City tours',
                                'Food & culture',
                                'Pilgrimage',
                                'Luxury getaways',
                            ].map((style) => (
                                <button
                                    key={style}
                                    type="button"
                                    className={`bubble-btn ${form.travelStyles.includes(style) ? 'selected' : ''}`}
                                    onClick={() => handleChange(null, 'travelStyles', style)}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Traveler Type */}
                    <div className="full-profile-section">
                        <label>What kind of traveler are you?</label>
                        <div className="bubble-btn-container">
                            {[
                                'Solo traveler',
                                'Family & friends',
                                'Planner',
                                'Spontaneous',
                                'Foodie',
                                'Nature lover',
                            ].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`bubble-btn ${form.travelerType.includes(type) ? 'selected' : ''}`}
                                    onClick={() => handleChange(null, 'travelerType', type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="full-profile-section dob-section">
                        <label htmlFor="dateOfBirth">
                            Date of Birth <span className="required-star">*</span>
                        </label>
                        <DatePicker
                            id="dateOfBirth"
                            selected={form.dateOfBirth ? new Date(form.dateOfBirth) : null}
                            onChange={(date) =>
                                setForm((prev) => ({ ...prev, dateOfBirth: date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) }))
                            }
                            className="full-profile-input dob-input"
                            dateFormat="dd-MM-yyyy"
                            placeholderText="Select your date of birth"
                            maxDate={new Date()}
                            showYearDropdown
                            yearDropdownItemNumber={100}
                            scrollableYearDropdown
                            required
                        />
                    </div>

                    {/* Preferred Destinations */}
                    <div className="full-profile-section">
                        <label>Favorite travel destinations?</label>
                        <div className="full-profile-dropdown-container">
                            <input
                                type="text"
                                className="full-profile-input full-profile-search"
                                placeholder="Search destinations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setIsDropdownOpen(true)}
                                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                            />
                            {isDropdownOpen && (
                                <div className="full-profile-dropdown">
                                    {filteredLocations.filter(dest => !selectedLocationIds.includes(dest._id)).length > 0 ? (
                                        filteredLocations.map((dest) =>
                                            !selectedLocationIds.includes(dest._id) && (
                                                <div
                                                    key={dest._id}
                                                    className="full-profile-dropdown-item"
                                                    // onClick={() => handleDestinationSelect(dest)}
                                                    onMouseDown={() => handleDestinationSelect(dest)} // <--- changed from onClick

                                                >
                                                    {dest.title.replace(/[0-9.]/g, "")}
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <div className="full-profile-dropdown-item disabled">No matches found</div>
                                    )}
                                </div>
                            )}
                            <div className="full-profile-selected-destinations">
                                {selectedTitles.map((title) => (
                                    <span key={title} className="full-profile-selected-tag">
                                        {title.replace(/[0-9.]/g, "")}
                                        <button
                                            type="button"
                                            className="full-profile-remove-tag"
                                            onClick={() => {
                                                const destId = locations.find((loc) => loc.title === title)._id;
                                                setSelectedLocationIds((prev) => prev.filter((id) => id !== destId));
                                            }}

                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Other form fields remain unchanged */}
                    {/* Dream Destinations */}
                    <div className="full-profile-section">
                        <label>Your dream travel spots?</label>
                        <input
                            type="text"
                            name="dreamDestinations"
                            className="full-profile-input"
                            onChange={handleChange}
                            placeholder="e.g., Leh-Ladakh, Maldives"
                        />
                    </div>

                    {/* Match Gender */}
                    <div className="full-profile-section">
                        <label>Who would you like to travel with?</label>
                        <select
                            name="matchGender"
                            className="full-profile-input"
                            onChange={handleChange}
                            value={form.matchGender}
                        >
                            <option value="Same">Same gender only</option>
                            <option value="Any">Anyone</option>
                            <option value="Custom">Custom (later)</option>
                        </select>
                    </div>

                    {/* Age Group */}
                    <div className="full-profile-section">
                        <label>Preferred age group for travel buddies?</label>
                        <select
                            name="ageGroup"
                            className="full-profile-input"
                            onChange={handleChange}
                            value={form.ageGroup}
                        >
                            <option value="">Any age group</option>
                            <option value="18-25">18-25</option>
                            <option value="25-35">25-35</option>
                            <option value="35-45">35-45</option>
                            <option value="45+">45+</option>
                        </select>
                    </div>

                    {/* Visibility & Invites */}
                    <div className="full-profile-section">
                        <label>Profile settings:</label>
                        <label className="full-profile-checkbox">
                            <input
                                type="checkbox"
                                name="showProfile"
                                checked={form.showProfile}
                                onChange={(e) => setForm((prev) => ({ ...prev, showProfile: e.target.checked }))}
                            />
                            Show my profile to others
                        </label>
                        <label className="full-profile-checkbox">
                            <input
                                type="checkbox"
                                name="allowInvites"
                                checked={form.allowInvites}
                                onChange={(e) => setForm((prev) => ({ ...prev, allowInvites: e.target.checked }))}
                            />
                            Allow trip invites
                        </label>
                    </div>

                    {/* Profile Picture */}
                    <div className="full-profile-section">
                        <label>
                            Upload a profile picture{' '}
                            <span className="full-profile-optional">
                                {user.profile_picture && user.profile_picture.length > 0 ? '(Optional)' : '(Required)'}
                            </span>
                        </label>
                        <input
                            type="file"
                            name="profilePicture"
                            className="full-profile-input"
                            onChange={handleChange}
                            accept="image/*"
                            required={!user.profile_picture || user.profile_picture.length === 0}
                        />
                    </div>

                    {/* Optional Extras */}
                    <div className="full-profile-section">
                        <label>Instagram handle (optional):</label>
                        <input
                            type="text"
                            name="instagram"
                            className="full-profile-input"
                            onChange={handleChange}
                            placeholder="@yourhandle"
                        />
                        <label>Your travel goal:</label>
                        <select
                            name="travelGoal"
                            className="full-profile-input"
                            onChange={handleChange}
                            value={form.travelGoal}
                        >
                            <option value="">Select a goal</option>
                            <option value="Explore India">Explore India</option>
                            <option value="Make friends">Make friends</option>
                            <option value="Relax">Relax</option>
                            <option value="Spiritual journey">Spiritual journey</option>
                        </select>
                        <label>Languages you speak:</label>
                        <input
                            type="text"
                            name="languages"
                            className="full-profile-input"
                            onChange={handleChange}
                            placeholder="e.g., Hindi, English, Tamil"
                        />
                    </div>

                    <button type="submit" className="btn btn-black">
                        Save Profile
                    </button>
                </form>
            </div>
        </div>
    );
}