import React, { useState } from 'react';
import LocationCard from '../LocationCard/LocationCard';
import loader from '../../assets/images/loader.gif';

const ExploreSection = ({ locations, isLoading }) => {
    const [visibleCount, setVisibleCount] = useState(window.innerWidth < 550 ? 10 : 16);
    const [isAllLoaded, setIsAllLoaded] = useState(false);

    const handleShowMoreClick = () => {
        if (!isAllLoaded) {
            // onShowMore(); // Fetch up to 1000 locations
            setVisibleCount(100); // Set to max limit
            setIsAllLoaded(true); // Hide button after fetching all
        }
    };

    if (!locations.length) {
        return <div><img src={loader} alt='Loading Locations'></img></div>;
    }
    const convertLongBestTimeNameToShortNotations = (bestTime) => {
        const bestTimeMap = {
            'January': 'Jan',
            'February': 'Feb',
            'March': 'Mar',
            'April': 'Apr',
            'May': 'May',
            'June': 'Jun',
            'July': 'Jul',
            'August': 'Aug',
            'September': 'Sep',
            'October': 'Oct',
            'November': 'Nov',
            'December': 'Dec',
        };
        // for each word in best time if content length is greater than 50 then for each word change the best time map if word matachs 
        // if not then return the word as it is
        if (bestTime.length > 20 || bestTime.includes(',') || bestTime.includes(';')) {
            return bestTime.split(' ').map((word) => {
                const ContainComma = word.includes(',') || word.includes(';');
                word = word.replace(/[,;]/g, '');
                if (bestTimeMap[word]) {
                    return bestTimeMap[word] + (ContainComma ? ' & ' : '');

                } else {
                    return word + (ContainComma ? ' & ' : '');
                }
            }).join(' ');
        }
        else {
            return bestTime;
        }
    };

    return (
        <section>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    rowGap: "15px"
                }}
            >
                {locations.slice(0, visibleCount).map((location, index) => (
                    <LocationCard

                        key={location._id || index}
                        name={location.title?.replace(/[0-9. ]/g, '') || 'Unknown'}
                        rating={location.rating || 'N/A'}
                        places={location.placesNumberToVisit}
                        bestTime={convertLongBestTimeNameToShortNotations(location.best_time) || 'N/A'}
                        images={
                            location.images?.length > 0
                                ? location.images
                                : ['https://via.placeholder.com/300x200?text=No+Image']
                        }
                        onClickFunction={() => {
                            window.location.href = `/location/${location._id}`;
                        }}
                    />
                ))}
            </div>
            {locations.length > 12 && !isAllLoaded && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <button
                        className="btn btn-black"
                        onClick={handleShowMoreClick}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Show More'}
                    </button>
                </div>
            )}
            {isLoading && locations.length > 0 && (
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    Loading more locations...
                </div>
            )}
        </section>
    );
};

export default ExploreSection;