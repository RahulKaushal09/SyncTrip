import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/LocationMap.css'; // Optional: for custom styling
import { GoArrowUpRight } from "react-icons/go";

// Custom icon for the marker (optional, to match the blue circle in the image)
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default marker, replace with custom image if needed
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const LocationMapSection = () => {
    // Coordinates for 329 Kent Ave, Brooklyn (approximate)
    const position = [33.2778322, 75.3000181];

    return (
        <div className="location-map">
            <div className='d-flex' style={{ justifyContent: 'space-between', alignItems: 'start' }}>
                <h2 className='DescriptionHeading'>Location</h2>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`} target="_blank" rel="noopener noreferrer" className="get-direction DescriptionHighlightText">
                    Get Direction <span><GoArrowUpRight /></span>
                </a>
            </div>
            <p>329 Kent Ave, Brooklyn</p>

            <div className="map-container">
                <MapContainer center={position} zoom={13} style={{ height: '300px', width: '100%' }}>
                    <TileLayer

                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position} icon={customIcon}>
                        <Popup>
                            329 Kent Ave, Brooklyn
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <hr></hr>
        </div>
    );
};

export default LocationMapSection;