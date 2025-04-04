import React, { useState, useEffect, useMemo } from 'react';
import MainSearchBar from '../../components/SearchPanel/MainSeachBar';
import ExploreSection from '../../components/Explore/ExploreSection';
import PreMadeItinerary from '../../components/preItinearies/PreMadeItinerary';
import FestivalsEvents from '../../components/FestivalEventSection/festivalsEvents';
import TrendingSection from '../../components/TrendingSection/TrendingSection';
import TopDestitnations from '../../components/TopDestitnations/TopDestitnations';
import SyncTripAppPushingSection from '../../components/AppPushingSection/AppPushingSection';

const Home = ({ ctaAction, handleIsLoading, hasFetchedLocations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    const [locationsForPreMadeItinerary, setLocationsForPreMadeItinerary] = useState([]);

    // Handle Search Input
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // Fetch Locations Only Once
    useEffect(() => {
        const fetchInitialLocations = async () => {
            if (hasFetchedLocations.current) {
                console.log('Locations already fetched, skipping API call');
                return;
            }
            hasFetchedLocations.current = true;
            console.log('Fetching locations...');

            handleIsLoading(true); // Show loader

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ limit: 100 }),
                });

                if (!response.ok) throw new Error('Failed to fetch locations');

                const data = await response.json();
                setLocations(data.locations || data);
                setLocationsForPreMadeItinerary(data.locations || data); // Set locations for Pre-Made Itinerary
            } catch (err) {
                setError(err.message);
            } finally {
                handleIsLoading(false); // Hide loader
                console.log('Fetch complete');
            }
        };

        fetchInitialLocations();
    }, [handleIsLoading, hasFetchedLocations]); // Dependencies added for clarity

    // Memoized Filtered Locations
    const filteredLocations = useMemo(() => {
        return locations.filter((location) =>
            location.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [locations, searchTerm]);

    return (
        <div className="HomePage">
            <MainSearchBar searchTerm={searchTerm} setSearchTerm={handleSearchChange} searchBarPlaceHolder={"Search destinations, hotels"} />
            <ExploreSection locations={filteredLocations} />
            {error && <div>Error: {error}</div>}
            <PreMadeItinerary locations={locationsForPreMadeItinerary} />
            <FestivalsEvents />
            <TrendingSection ctaAction={ctaAction} />
            <TopDestitnations />
            <SyncTripAppPushingSection ctaAction={ctaAction} />
        </div>
    );
};

export default Home;