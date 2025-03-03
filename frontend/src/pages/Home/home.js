import React, { useState, useCallback } from 'react';
import MainSearchBar from '../../components/SearchPanel/MainSeachBar';
import ExploreSection from '../../components/Explore/ExploreSection';
import PreMadeItinerary from '../../components/preItinearies/PreMadeItinerary';
import FestivalsEvents from '../../components/FestivalEventSection/festivalsEvents';
import TrendingSection from '../../components/TrendingSection/TrendingSection';
import TopDestitnations from '../../components/TopDestitnations/TopDestitnations';
import SyncTripAppPushingSection from '../../components/AppPushingSection/AppPushingSection';
import locations from '../../data/locations.json';
import { debounce } from 'lodash'; // Install lodash if needed


const Home = () => {
    const [searchTerm, setSearchTerm] = useState(""); // State to hold search input

    const debouncedSetSearchTerm = useCallback(
        debounce((value) => setSearchTerm(value), 300), []
    );

    const handleSearchChange = (value) => {
        debouncedSetSearchTerm(value);
    };
    // Filter locations based on search term
    const filteredLocations = locations.filter((location) =>
        location.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <MainSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <ExploreSection locations={filteredLocations} />
            {/* <MainSearchBar />
            <ExploreSection /> */}

            <PreMadeItinerary />
            <FestivalsEvents />
            <TrendingSection />
            <TopDestitnations />
            <SyncTripAppPushingSection />
        </div>
    );
}
export default Home;
