import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GoArrowUpRight } from "react-icons/go";
import LocationEventsDetails from '../../components/Details/locationEventsDetials';
import LocationImageGallery from '../../components/Details/locationImages';
import AddLocationCard from '../../components/Details/AddLocationCard';
import Discription from '../../components/Details/description';
import HotelsAndStaysSection from '../../components/Details/HotelSection';
import PlanTripDates from '../../components/Details/PlanTripDates';
import LocationMapSection from '../../components/Details/MapSection';
import PlacesToVisitSection from '../../components/Details/PlacesToVisit';
import SyncTripAppPushingSection from '../../components/AppPushingSection/AppPushingSection';
const DestinationPage = ({ ctaAction }) => {
    const [isMobile, setIsMobile] = useState(false);

    // Effect to detect screen size (optional)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust breakpoint as needed
        };
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className="DestinationPage">
            <LocationEventsDetails type="Explore" location="Manali" title="Manali snowfall" rating="4.6" country="India" />
            <LocationImageGallery />
            {/* Conditionally render AddLocationCard based on mobile view */}
            {isMobile && <AddLocationCard ctaAction={ctaAction} />}
            <div className="row" style={{ position: 'relative' }}>
                <div className="col-lg-8">
                    {!isMobile && <Discription />}
                    <HotelsAndStaysSection />
                    <PlanTripDates ctaAction={ctaAction} />
                    <LocationMapSection />
                    <PlacesToVisitSection ctaAction={ctaAction} />
                    {/* {!isMobile && <Discription />} Ensure Discription renders on desktop */}
                </div>
                {!isMobile && (
                    <div
                        className="col-lg-4"
                        style={{
                            position: 'sticky',
                            top: '0px',
                            right: '0px',
                        }}
                    >
                        <AddLocationCard ctaAction={ctaAction} />
                    </div>
                )}
            </div>
            <SyncTripAppPushingSection showWork={false} ctaAction={ctaAction} />
        </div>
    );
};

export default DestinationPage;