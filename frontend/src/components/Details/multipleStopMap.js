import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const RoutingMachine = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !waypoints.length) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints.map(coord => L.latLng(coord[0], coord[1])),
            routeWhileDragging: false,
            show: false,
            addWaypoints: false,
            lineOptions: {
                styles: [{ color: 'blue', opacity: 0.7, weight: 6 }]
            },
            createMarker: function () { return null; }, // if you don't want default markers
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, waypoints]);

    return null;
};

const MultiStopMap = ({ waypoints }) => {
    const center = waypoints?.[0] || [0, 0];

    return (
        <div style={{ height: '300px', width: '100%' }}>
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <RoutingMachine waypoints={waypoints} />
            </MapContainer>
        </div>
    );
};

export default MultiStopMap;
