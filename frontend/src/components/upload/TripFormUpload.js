import React, { useState, useRef, useEffect } from 'react';
import { useLoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const libraries = ['places'];

const SearchDropdown = ({ locations, setSelectedLocation }) => {
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
        setSearchQuery(location.title.replace(/[0-9. ]/g, '') || 'Unknown');
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
                            <li key={location._id} className="dropdown-item" onClick={() => handleSelectChange(location)}>
                                {location.title.replace(/[0-9. ]/g, '') || 'Unknown'}
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

const TripForm = () => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [pickupPosition, setPickupPosition] = useState({ lat: 0, lng: 0 });
    const [dropPosition, setDropPosition] = useState({ lat: 0, lng: 0 });
    // console.log(process.env.REACT_APP_BACKEND_BASE_URL);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ limit: 100 })
                });
                if (!response.ok) throw new Error('Failed to fetch locations');
                const data = await response.json();
                setLocations(data.locations || data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLocations();
    }, []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const [formData, setFormData] = useState({
        title: '',
        locationId: '',
        itinerary: '',
        tripRating: 5,
        requirements: {
            age: 0,
            fitnessCriteria: '',
            status: '',
            previousExp: ''
        },
        essentials: {
            region: '',
            duration: '',
            bestTime: '',
            timeline: { fromDate: '', tillDate: '' },
            altitude: '',
            typeOfTrip: '',
            price: '',
            season: '',
            pickup: { name: '', mapLocation: { lat: 0, long: 0 } },
            dropPoint: { name: '', mapLocation: { lat: 0, long: 0 } },
        },
    });

    const pickupRef = useRef(null);
    const dropRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        setFormData(prev => {
            let newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return { ...newData };
        });

        // If the user updates the timeline, recalculate the duration
        if (name === "essentials.timeline.fromDate" || name === "essentials.timeline.tillDate") {
            calculateDuration(formData.essentials.timeline.fromDate, formData.essentials.timeline.tillDate);
        }
    };

    const calculateDuration = (fromDate, tillDate) => {
        if (fromDate && tillDate) {
            const from = new Date(fromDate);
            const till = new Date(tillDate);

            // Calculate the difference in days
            const diffTime = Math.abs(till - from);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Update the duration field in the format of 3D 2N
            const days = diffDays;
            const nights = diffDays - 1;

            // Format the duration as "X days Y nights"
            const duration = `${days}D ${nights}N`;

            // Update the formData with the calculated duration
            setFormData(prev => ({
                ...prev,
                essentials: {
                    ...prev.essentials,
                    duration: duration
                }
            }));
        }
    };
    const handlePlaceSelect = (place, type) => {
        if (place && place.geometry) {
            const position = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setFormData(prev => ({
                ...prev,
                essentials: {
                    ...prev.essentials,
                    [type]: {
                        name: place.name || place.formatted_address,
                        mapLocation: position,
                    },
                },
            }));
            type === 'pickup' ? setPickupPosition(position) : setDropPosition(position);
        }
    };

    const handleMarkerDragEnd = (e, type) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        type === 'pickup' ? setPickupPosition({ lat, lng }) : setDropPosition({ lat, lng });

        // Update the corresponding location in the form (pickup or drop)
        setFormData(prev => ({
            ...prev,
            essentials: {
                ...prev.essentials,
                [type]: {
                    ...prev.essentials[type],
                    mapLocation: { lat, long: lng },
                },
            },
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow p-4 w-50">
                <h2 className="text-center mb-4">Create New Trip</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="form-control" />
                    </div>

                    {/* Searchable Location Dropdown */}
                    <SearchDropdown locations={locations} setSelectedLocation={(id) => setFormData({ ...formData, locationId: id })} />

                    <div className="mb-3">
                        <label className="form-label">Region:</label>
                        <input type="text" name="essentials.region" value={formData.essentials.region} onChange={handleChange} className="form-control" />
                    </div>



                    <div className="mb-3">
                        <label className="form-label">Best Time to Visit:</label>
                        <input type="text" name="essentials.bestTime" value={formData.essentials.bestTime} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Timeline:</label>
                        <div className="d-flex gap-2">
                            <input type="date" name="essentials.timeline.fromDate" value={formData.essentials.timeline.fromDate} onChange={handleChange} className="form-control" />
                            <input type="date" name="essentials.timeline.tillDate" value={formData.essentials.timeline.tillDate} onChange={handleChange} className="form-control" />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Itinerary:</label>
                        <textarea name="itinerary" value={formData.itinerary} onChange={handleChange} className="form-control" rows="3"></textarea>
                    </div>
                    <div className="mb-3">
                        <h3 className="text-start">Requirements</h3>
                        <label className="form-label">Age:</label>
                        <input type="number" name="requirements.age" value={formData.requirements.age} onChange={handleChange} className="form-control" />
                        <label className="form-label">Fitness Criteria:</label>
                        <input type="text" name="requirements.fitnessCriteria" value={formData.requirements.fitnessCriteria} onChange={handleChange} className="form-control" />
                        <label className="form-label">Status:</label>
                        <select name="requirements.status" value={formData.requirements.status} onChange={handleChange} className="form-control">
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                        </select>
                        <label className="form-label">Previous Experience:</label>
                        <input type="text" name="requirements.previousExp" value={formData.requirements.previousExp} onChange={handleChange} className="form-control" />
                    </div>


                    <div className="mb-3">
                        <label className="form-label">Duration:</label>
                        <input type="text" name="essentials.duration" value={formData.essentials.duration} onChange={handleChange} className="form-control" readOnly />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Altitude:</label>
                        <input type="number" name="essentials.altitude" value={formData.essentials.altitude} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Type of Trip:</label>
                        <select name="essentials.typeOfTrip" value={formData.essentials.typeOfTrip} onChange={handleChange} className="form-control">
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
                        <input type="number" name="essentials.price" value={formData.essentials.price} onChange={handleChange} className="form-control" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Season:</label>
                        <select name="essentials.season" value={formData.essentials.season} onChange={handleChange} className="form-control">
                            <option value="">Select Season</option>
                            <option value="Summer">Summer</option>
                            <option value="Winter">Winter</option>
                            <option value="Monsoon">Monsoon</option>
                            <option value="Spring">Spring</option>
                        </select>
                    </div>

                    {/* <div className="mb-3">
                        <label className="form-label">Pickup Location:</label>
                        {isLoaded && (
                            <Autocomplete onLoad={(autocomplete) => (pickupRef.current = autocomplete)} onPlaceChanged={() => handlePlaceSelect(pickupRef.current.getPlace(), 'pickup')}>
                                <input type="text" placeholder="Enter pickup location" className="form-control" />
                            </Autocomplete>
                        )}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Drop Point:</label>
                        {isLoaded && (
                            <Autocomplete onLoad={(autocomplete) => (dropRef.current = autocomplete)} onPlaceChanged={() => handlePlaceSelect(dropRef.current.getPlace(), 'dropPoint')}>
                                <input type="text" placeholder="Enter drop point" className="form-control" />
                            </Autocomplete>
                        )}
                    </div> */}

                    <div className="mb-3">
                        <label className="form-label">Pickup Location:</label>
                        {isLoaded && (
                            <Autocomplete onLoad={(autocomplete) => (pickupRef.current = autocomplete)} onPlaceChanged={() => handlePlaceSelect(pickupRef.current.getPlace(), 'pickup')}>
                                <input type="text" placeholder="Enter pickup location" className="form-control" />
                            </Autocomplete>
                        )}
                        Lat: {pickupPosition.lat}, Lng: {pickupPosition.lng}
                    </div>
                    <GoogleMap center={pickupPosition} zoom={10} mapContainerStyle={{ height: '300px', width: '100%' }}>
                        <Marker
                            position={pickupPosition}
                            draggable={true}
                            onDragEnd={(e) => handleMarkerDragEnd(e, 'pickup')}
                        />
                    </GoogleMap>

                    <div className="mb-3">
                        <label className="form-label">Drop Point:</label>
                        {isLoaded && (
                            <Autocomplete onLoad={(autocomplete) => (dropRef.current = autocomplete)} onPlaceChanged={() => handlePlaceSelect(dropRef.current.getPlace(), 'dropPoint')}>
                                <input type="text" placeholder="Enter drop point" className="form-control" />
                            </Autocomplete>
                        )}
                        Lat: {dropPosition.lat}, Lng: {dropPosition.lng}

                    </div>

                    <GoogleMap center={dropPosition} zoom={10} mapContainerStyle={{ height: '300px', width: '100%' }}>
                        <Marker
                            position={dropPosition}
                            draggable={true}
                            onDragEnd={(e) => handleMarkerDragEnd(e, 'dropPoint')}
                        />
                    </GoogleMap>


                    <button type="submit" className="btn btn-primary w-100">Create Trip</button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;
