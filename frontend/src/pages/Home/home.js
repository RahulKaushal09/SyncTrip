import React, { useState, useMemo } from 'react';
import MainSearchBar from '../../components/SearchPanel/MainSeachBar';
import ExploreSection from '../../components/Explore/ExploreSection';
import PreMadeItinerary from '../../components/preItinearies/PreMadeItinerary';
import FestivalsEvents from '../../components/FestivalEventSection/festivalsEvents';
import TrendingSection from '../../components/TrendingSection/TrendingSection';
import TopDestitnations from '../../components/TopDestitnations/TopDestitnations';
import SyncTripAppPushingSection from '../../components/AppPushingSection/AppPushingSection';
import { AllfetchLocations } from '../../utils/CommonServices';
import { Helmet } from "react-helmet-async";
import { metaTags } from '../../seoData/metaTags';
import { homeSchema, locationSchema } from '../../seoData/seoSchemas';
const Home = ({ ctaAction, locations, locationsForPreMadeItinerary, setLocations, handleShowMoreHome }) => {
    const meta = metaTags.home;
    const [searchTerm, setSearchTerm] = useState('');
    // const [searchResults, setSearchResults] = useState([]);
    const [hasFetchedAll, setHasFetchedAll] = useState(false);
    const [searching, setSearching] = useState(false);
    const [mobileView, setMobileView] = useState(window.innerWidth < 550);

    // Handle Search Input
    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    // Effect to handle search
    // Memoized Filtered Locations
    const filteredLocations = useMemo(() => {
        if (locations !== undefined) {
            const lowerSearch = searchTerm.toLowerCase();

            const startsWith = [];
            const includes = [];

            locations.forEach((location) => {
                const title = location.title?.toLowerCase() || "";
                if (title.startsWith(lowerSearch)) {
                    startsWith.push(location);
                } else if (title.includes(lowerSearch)) {
                    includes.push(location);
                }
            });

            const localFiltered = [...startsWith, ...includes];

            if (searchTerm === "" || localFiltered.length > 0 || hasFetchedAll) {
                return localFiltered;
            }

            if (!searching) {
                (async () => {
                    try {
                        setSearching(true);
                        const result = await AllfetchLocations();
                        const all = Array.isArray(result?.locations) ? result.locations : Array.isArray(result) ? result : [];

                        const merged = [...locations];
                        all.forEach(loc => {
                            if (!merged.some(existing => existing._id === loc._id)) {
                                merged.push(loc);
                            }
                        });


                        setLocations(merged);
                        setHasFetchedAll(true);
                        setSearching(false);
                    } catch (error) {
                        console.error("Error fetching all locations:", error);
                    }
                })();
            }

            return localFiltered;
        }
        return [];
    }, [searchTerm, locations]);

    // // Memoized Filtered Locations
    // const filteredLocations = useMemo(() => {
    //     const filterLoc = locations.filter((location) =>
    //         location.title?.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    //     if (searchTerm != "" && filterLoc && filterLoc.length > 0 && searchTerm.length > 0) {
    //         return filterLoc;
    //     }
    //     else {
    //         const locationsAll = AllfetchLocations();
    //         setLocations(locationsAll.locations);
    //         const filterLoc = locations.filter((location) =>
    //             location.title?.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //         return filterLoc;
    //     }
    // }, [locations, searchTerm]);
    // get random 12 lcoations form locaiton variable 
    let randomLocations = useMemo(() => {
        const shuffled = [...locations].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 12);
    }
        , [locations]);

    const locationJsonLd = locationSchema(locations);
    return (

        <div className="HomePage">
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta name="keywords" content={meta.keywords} />

                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://synctrip.in" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={meta.title} />
                <meta name="twitter:description" content={meta.description} />

                {/* JSON-LD */}
                <script type="application/ld+json">{JSON.stringify(homeSchema)}</script>
                <script type="application/ld+json">{JSON.stringify(locationJsonLd)}</script>

            </Helmet>

            <MainSearchBar
                searchTerm={searchTerm}
                setSearchTerm={handleSearchChange}
                searchBarPlaceHolder={"Search destinations, hotels"}
            />
            <ExploreSection
                locations={filteredLocations}
                handleShowMoreClick={handleShowMoreHome}
                searching={searching}
                showMoreButtonToShow={searchTerm.length === 0 ? true : false}
            />

            {/* {error && <div>Error: {error}</div>} */}
            <PreMadeItinerary locations={locationsForPreMadeItinerary} />
            <FestivalsEvents />
            {!mobileView && <TrendingSection ctaAction={ctaAction} />}

            <TopDestitnations locations={randomLocations} />
            <SyncTripAppPushingSection ctaAction={ctaAction} />
        </div>
    );
};

export default Home;