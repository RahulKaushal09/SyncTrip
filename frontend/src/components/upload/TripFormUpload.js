import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLoadScript, GoogleMap, Autocomplete } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import toast from 'react-hot-toast';

import HotelFormModal from './HotelFormModel'; // Assuming this is the correct path to your modal component
// Define libraries for Google Maps API
const libraries = ['places'];

// Default map center (e.g., a fallback location like New York City)
const DEFAULT_CENTER = { lat: 40.7128, long: -74.0060 };

const SearchDropdownLocation = ({ locations, setSelectedLocation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showLocationDropDowns, setShowLocationDropDowns] = useState(false);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setShowLocationDropDowns(true);
        if (e.target.value === '') {
            setShowLocationDropDowns(false);
        }
    };

    const filteredLocations = locations.filter((location) =>
        location.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectChange = (location) => {
        setSearchQuery(location.title.replace(/[0-9.]/g, '') || 'Unknown');
        setShowLocationDropDowns(false);
        setSelectedLocation(location._id);
    };

    return (
        <div className="mb-3 position-relative">
            <label className="form-label">Location:</label>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="form-control"
                placeholder="Search for a location"
            />
            {searchQuery && showLocationDropDowns && (
                <ul className="dropdown-menu show w-100" style={{ position: 'absolute', zIndex: 1000 }}>
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map((location) => (
                            <li
                                key={location._id}
                                className="dropdown-item"
                                onClick={() => handleSelectChange(location)}
                            >
                                {location.title.replace(/[0-9.]/g, '') || 'Unknown'}
                            </li>
                        ))
                    ) : (
                        <li className="dropdown-item text-muted">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};
const SearchDropdownHotel = ({ locationId, selectedHotelId, setSelectedHotelId }) => {
    const [hotels, setHotels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedHotels, setSelectedHotels] = useState([]);

    useEffect(() => {
        console.log('Location ID:', locationId); // Log the locationId to check if it's being set correctly

        const fetchHotels = async () => {
            if (locationId) {
                // /getallhotelsFromLocationId/:locationId
                const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/hotels/getallhotelsFromLocationId/${locationId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!res.ok) {
                    console.error('Failed to fetch hotels:', res.statusText);
                    return;
                }
                const data = await res.json();
                setHotels(data);
            }
        };
        fetchHotels();
    }, [locationId]);
    useEffect(() => {
        console.log('Selected Hotel IDs:', selectedHotelId); // Log the selected hotel IDs

    }, [selectedHotelId]);

    const filteredHotels = hotels.filter((hotel) =>
        hotel.hotel_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (hotel) => {
        setSelectedHotelId(hotel._id); // Set the selected hotel ID
        setSelectedHotels((prevSelected) => {
            if (!prevSelected.includes(hotel)) {
                return [...prevSelected, hotel];
            }
            return prevSelected; // if already selected, don't add again
        });
        setSearchQuery(''); // Clear search box
        setShowDropdown(false); // Hide dropdown
    };

    return (
        <div className="mb-3 position-relative">
            <label className="form-label">Hotels:</label>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                }}
                className="form-control"
                placeholder="Search for hotels"
            />
            {searchQuery && showDropdown && (
                <ul className="dropdown-menu show w-100" style={{ position: 'absolute', zIndex: 1000 }}>
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => (
                            <li id={hotel._id} key={hotel._id} className="dropdown-item" onClick={() => handleSelect(hotel)}>
                                {hotel.hotel_name}
                            </li>
                        ))
                    ) : (
                        <>
                            <li className="dropdown-item text-muted">No hotels found</li>
                            <li
                                className="dropdown-item text-primary"
                                onClick={() => {
                                    setShowModal(true);
                                    setShowDropdown(false);
                                }}
                            >
                                + Create New Hotel
                            </li>
                        </>
                    )}
                </ul>
            )}

            {showModal && (
                <HotelFormModal
                    locationId={locationId}
                    onClose={() => setShowModal(false)}
                    onHotelAdded={(newHotelId) => {
                        setSelectedHotelId([...selectedHotelId, newHotelId]);
                        setShowModal(false);
                    }}
                />
            )}
            {selectedHotels.length > 0 && (
                <div className="mt-2">
                    <h5>Selected Hotels:</h5>
                    <ul className="list-group">
                        {selectedHotels.map((hotel) => (
                            <li id={hotel._id} key={hotel._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {hotel.hotel_name}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => {
                                        setSelectedHotelId((prev) => prev.filter((id) => id !== hotel._id));
                                        setSelectedHotels((prev) => prev.filter((h) => h._id !== hotel._id));
                                    }}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>
            )}
        </div>
    );
};

const TripForm = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    // Initialize with valid coordinates using 'long'
    const [pickupPosition, setPickupPosition] = useState(DEFAULT_CENTER);
    const [dropPosition, setDropPosition] = useState(DEFAULT_CENTER);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            window.location.href = '/'; // Redirect to login page
        }
    }, []);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ limit: 100 }),
                    }
                );
                if (!response.ok) throw new Error('Failed to fetch locations');
                const data = await response.json();
                setLocations(data.locations || data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLocations();
    }, []);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    const [formData, setFormData] = useState({
        title: '',
        locationId: '',
        MainImage: null, // Store file object instead of URL
        itinerary: '',
        tripRating: 5,
        requirements: {
            age: 0,
            fitnessCriteria: '',
            status: '',
            previousExp: '',
        },
        essentials: {
            region: '',
            availableSeats: 10,
            duration: '',
            bestTime: '',
            timeline: { fromDate: '', tillDate: '' },
            altitude: '',
            typeOfTrip: '',
            price: '',
            season: '',
            pickup: { name: '', mapLocation: DEFAULT_CENTER },
            dropPoint: { name: '', mapLocation: DEFAULT_CENTER },
        },
        selectedHotelId: [],
    });

    const pickupRef = useRef(null);
    const dropRef = useRef(null);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     const keys = name.split('.');

    //     setFormData((prev) => {
    //         let newData = { ...prev };
    //         let current = newData;
    //         for (let i = 0; i < keys.length - 1; i++) {
    //             current = current[keys[i]];
    //         }
    //         current[keys[keys.length - 1]] = value;
    //         return { ...newData };
    //     });

    //     if (name === 'essentials.timeline.fromDate' || name === 'essentials.timeline.tillDate') {
    //         calculateDuration(formData.essentials.timeline.fromDate, formData.essentials.timeline.tillDate);
    //     }
    // };
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'MainImage') {
            // Handle file input
            setFormData((prev) => ({
                ...prev,
                MainImage: files[0] || null, // Store the file object
            }));
        } else {
            // Handle text inputs (including nested fields)
            const keys = name.split('.');
            setFormData((prev) => {
                let newData = { ...prev };
                let current = newData;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
                return newData;
            });

            // Calculate duration for timeline changes
            if (name === 'essentials.timeline.fromDate' || name === 'essentials.timeline.tillDate') {
                calculateDuration(
                    name === 'essentials.timeline.fromDate'
                        ? value
                        : formData.essentials.timeline.fromDate,
                    name === 'essentials.timeline.tillDate'
                        ? value
                        : formData.essentials.timeline.tillDate
                );
            }
        }
    };

    const calculateDuration = (fromDate, tillDate) => {
        if (fromDate && tillDate) {
            const from = new Date(fromDate);
            const till = new Date(tillDate);
            const diffTime = Math.abs(till - from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const days = diffDays;
            const nights = diffDays - 1;
            const duration = `${days}D ${nights}N`;

            setFormData((prev) => ({
                ...prev,
                essentials: {
                    ...prev.essentials,
                    duration,
                },
            }));
        }
    };

    const handlePlaceSelect = (place, type) => {
        if (place && place.geometry && place.geometry.location) {
            const position = {
                lat: place.geometry.location.lat(),
                long: place.geometry.location.lng(), // Use 'long' to match backend
            };

            // Validate coordinates
            if (isNaN(position.lat) || isNaN(position.long)) {
                console.error(`Invalid coordinates for ${type}:`, position);
                return;
            }

            setFormData((prev) => ({
                ...prev,
                essentials: {
                    ...prev.essentials,
                    [type]: {
                        name: place.name || place.formatted_address || 'Unknown',
                        mapLocation: position,
                    },
                },
            }));

            type === 'pickup' ? setPickupPosition(position) : setDropPosition(position);
        } else {
            console.error(`No valid geometry for ${type} place:`, place);
        }
    };

    const handleMarkerDragEnd = (e, type) => {
        const lat = e.latLng.lat();
        const long = e.latLng.lng(); // Use 'long' to match backend

        // Validate coordinates
        if (isNaN(lat) || isNaN(long)) {
            console.error(`Invalid drag coordinates for ${type}:`, { lat, long });
            return;
        }

        const position = { lat, long };
        type === 'pickup' ? setPickupPosition(position) : setDropPosition(position);

        setFormData((prev) => ({
            ...prev,
            essentials: {
                ...prev.essentials,
                [type]: {
                    ...prev.essentials[type],
                    mapLocation: position,
                },
            },
        }));
    };
    useEffect(() => {
        console.log("selectedHotelId", formData.selectedHotelId);
    }, [formData.selectedHotelId]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate coordinates before submission
        const { pickup, dropPoint } = formData.essentials;
        if (
            isNaN(pickup.mapLocation.lat) ||
            isNaN(pickup.mapLocation.long) ||
            isNaN(dropPoint.mapLocation.lat) ||
            isNaN(dropPoint.mapLocation.long)
        ) {
            toast.error('Please select valid pickup and drop locations.');
            return;
        }
        // Prepare FormData for multipart/form-data
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('locationId', formData.locationId);
        if (formData.MainImage) {
            formDataToSend.append('MainImage', formData.MainImage);
        }
        formDataToSend.append('itinerary', encodeURI(formData.itinerary));
        formDataToSend.append('tripRating', formData.tripRating.toString());
        formDataToSend.append('requirements', JSON.stringify(formData.requirements));
        formDataToSend.append('essentials', JSON.stringify(formData.essentials));
        formDataToSend.append('selectedHotelId', JSON.stringify(formData.selectedHotelId));

        // Log payload for debugging
        console.log('Submitting formData:', Object.fromEntries(formDataToSend));

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/trips/addNewTrip`,
                {
                    method: 'POST',
                    body: formDataToSend,
                    headers: {
                        // 'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                toast.success('Trip added successfully!');
                // Reset form
                setFormData({
                    title: '',
                    locationId: '',
                    MainImage: null,
                    itinerary: '',
                    tripRating: 5,
                    requirements: {
                        age: 0,
                        fitnessCriteria: '',
                        status: '',
                        previousExp: '',
                    },
                    essentials: {
                        region: '',
                        availableSeats: 10,
                        duration: '',
                        bestTime: '',
                        timeline: { fromDate: '', tillDate: '' },
                        altitude: '',
                        typeOfTrip: '',
                        price: '',
                        season: '',
                        pickup: { name: '', mapLocation: DEFAULT_CENTER },
                        dropPoint: { name: '', mapLocation: DEFAULT_CENTER },
                    },
                    selectedHotelId: [],
                });
                setPickupPosition(DEFAULT_CENTER);
                setDropPosition(DEFAULT_CENTER);
            } else {
                const errorData = await response.json();
                toast.error(`Failed to add trip: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting trip:', error);
            toast.error(`Failed to add trip: ${error.message}`);
        }
    };
    const setSelectedHotelId = (id) => {
        const prevSelected = formData.selectedHotelId;

        if (prevSelected) {
            if (!prevSelected.includes(id)) {
                setFormData((prev) => ({
                    ...prev,
                    selectedHotelId: [...prev.selectedHotelId, id],
                }));
            }
            else {
                setFormData((prev) => ({
                    ...prev,
                    selectedHotelId: prev.selectedHotelId.filter((hotelId) => hotelId !== id),
                }));
            }
        }
    };
    // Memoize the map center to prevent unnecessary re-renders
    const pickupMapCenter = useMemo(() => pickupPosition, [pickupPosition]);
    const dropMapCenter = useMemo(() => dropPosition, [dropPosition]);

    if (loadError) {
        return <div>Error loading Google Maps: {loadError.message}</div>;
    }

    if (!isLoaded) {
        return <div>Loading Google Maps...</div>;
    }

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4 w-50">
                <h2 className="text-center mb-4">Create New Trip</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Main Image:</label>
                        <input
                            type="file"
                            name="MainImage"
                            onChange={handleChange}
                            className="form-control"
                            accept="image/*"
                        />
                    </div>

                    <SearchDropdownLocation
                        locations={locations}
                        setSelectedLocation={(id) => setFormData({ ...formData, locationId: id })}
                    />

                    <div className="mb-3">
                        <label className="form-label">Region:</label>
                        <input
                            type="text"
                            name="essentials.region"
                            value={formData.essentials.region}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Best Time to Visit:</label>
                        <input
                            type="text"
                            name="essentials.bestTime"
                            value={formData.essentials.bestTime}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Timeline:</label>
                        <div className="d-flex gap-2">
                            <input
                                type="date"
                                name="essentials.timeline.fromDate"
                                value={formData.essentials.timeline.fromDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                            <input
                                type="date"
                                name="essentials.timeline.tillDate"
                                value={formData.essentials.timeline.tillDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Itinerary:</label>
                        <textarea
                            name="itinerary"
                            value={formData.itinerary}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                        ></textarea>
                    </div>
                    <SearchDropdownHotel locationId={formData.locationId} selectedHotelId={formData.selectedHotelId} setSelectedHotelId={setSelectedHotelId} />
                    <div className="mb-3">
                        <h3 className="text-start">Requirements</h3>
                        <label className="form-label">Age:</label>
                        <input
                            type="number"
                            name="requirements.age"
                            value={formData.requirements.age}
                            onChange={handleChange}
                            className="form-control"
                        />
                        <label className="form-label">Fitness Criteria:</label>
                        <input
                            type="text"
                            name="requirements.fitnessCriteria"
                            value={formData.requirements.fitnessCriteria}
                            onChange={handleChange}
                            className="form-control"
                        />
                        <label className="form-label">Status:</label>
                        <select
                            name="requirements.status"
                            value={formData.requirements.status}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                        </select>
                        <label className="form-label">Previous Experience:</label>
                        <input
                            type="text"
                            name="requirements.previousExp"
                            value={formData.requirements.previousExp}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Duration:</label>
                        <input
                            type="text"
                            name="essentials.duration"
                            value={formData.essentials.duration}
                            className="form-control"
                            readOnly
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Altitude:</label>
                        <input
                            type="number"
                            name="essentials.altitude"
                            value={formData.essentials.altitude}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Type of Trip:</label>
                        <select
                            name="essentials.typeOfTrip"
                            value={formData.essentials.typeOfTrip}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">Select Type</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Mountains">Mountains</option>
                            <option value="Beach">Beach</option>
                            <option value="City">City</option>
                            <option value="Desert">Desert</option>
                            <option value="Trekking">Trekking</option>
                            <option value="Wildlife">Wildlife</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Historical">Historical</option>
                            <option value="Road Trip">Road Trip</option>
                            <option value="Cruise">Cruise</option>
                            <option value="Pilgrimage">Pilgrimage</option>
                            <option value="Rural Tourism">Rural Tourism</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Price:</label>
                        <input
                            type="number"
                            name="essentials.price"
                            value={formData.essentials.price}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Season:</label>
                        <select
                            name="essentials.season"
                            value={formData.essentials.season}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">Select Season</option>
                            <option value="Summer">Summer</option>
                            <option value="Winter">Winter</option>
                            <option value="Monsoon">Monsoon</option>
                            <option value="Spring">Spring</option>
                        </select>
                    </div>

                    {/* Pickup Location with Autocomplete */}
                    <div className="mb-3">
                        <label className="form-label">Pickup Location:</label>
                        <Autocomplete
                            onLoad={(autocomplete) => (pickupRef.current = autocomplete)}
                            onPlaceChanged={() => handlePlaceSelect(pickupRef.current.getPlace(), 'pickup')}
                        >
                            <input type="text" placeholder="Enter pickup location" className="form-control" />
                        </Autocomplete>
                        <div>Lat: {pickupPosition.lat}, Long: {pickupPosition.long}</div>
                    </div>

                    {/* Pickup Map */}
                    {isFinite(pickupPosition.lat) && isFinite(pickupPosition.long) && (
                        <GoogleMap
                            center={pickupMapCenter}
                            zoom={10}
                            mapContainerStyle={{ height: '300px', width: '100%' }}
                        >
                            <gmp-advanced-marker
                                position={pickupPosition}
                                draggable={true}
                                ondragend={(e) => handleMarkerDragEnd(e, 'pickup')}
                            ></gmp-advanced-marker>
                        </GoogleMap>
                    )}

                    {/* Drop Point with Autocomplete */}
                    <div className="mb-3">
                        <label className="form-label">Drop Point:</label>
                        <Autocomplete
                            onLoad={(autocomplete) => (dropRef.current = autocomplete)}
                            onPlaceChanged={() => handlePlaceSelect(dropRef.current.getPlace(), 'dropPoint')}
                        >
                            <input type="text" placeholder="Enter drop point" className="form-control" />
                        </Autocomplete>
                        <div>Lat: {dropPosition.lat}, Long: {dropPosition.long}</div>
                    </div>

                    {/* Drop Map */}
                    {isFinite(dropPosition.lat) && isFinite(dropPosition.long) && (
                        <GoogleMap
                            center={dropMapCenter}
                            zoom={10}
                            mapContainerStyle={{ height: '300px', width: '100%' }}
                        >
                            <gmp-advanced-marker
                                position={dropPosition}
                                draggable={true}
                                ondragend={(e) => handleMarkerDragEnd(e, 'dropPoint')}
                            ></gmp-advanced-marker>
                        </GoogleMap>
                    )}

                    <button type="submit" className="btn btn-primary w-100">Create Trip</button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;