import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MainSearchBar from './components/SearchPanel/MainSeachBar';
import LocationCard from './components/LocationCard/LocationCard';
import Navbar from './components/Navbar/Navbar';
import locations from './data/locations.json'; // Import the JSON file
import PreMadeItinerary from './components/preItinearies/PreMadeItinerary';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom';
const App = () => {
  const [visibleCount, setVisibleCount] = useState(12); // Start with 12 cards visible

  // Function to handle "Show More" click
  const handleShowMore = () => {
    setVisibleCount(locations.length); // Show all locations
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div style={{ margin: "0px 40px" }}>
          <MainSearchBar />
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              // margin: "0px 40px",
              flexWrap: "wrap"
            }}
          >
            {locations.slice(0, visibleCount).map((location, index) => (
              <LocationCard
                key={index}
                name={location.title?.replace(/[0-9. ]/g, '') || 'Unknown'} // Safely handle null/undefined title
                rating={location.rating || 'N/A'} // Safely handle null/undefined rating
                places={location.objective?.match(/\d+ Tourist attractions/)?.[0]?.replace(' Tourist attractions', '') || '0'} // Safely extract places
                bestTime={location.best_time || 'N/A'} // Safely handle null/undefined best_time
                images={location.images || ['https://via.placeholder.com/300x200?text=No+Image']} // Pass the images array or fallback
              />
            ))}
          </div>
          {visibleCount < locations.length && (
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button className="btn btn-black" onClick={handleShowMore}>
                Show More
              </button>
            </div>
          )}

          <PreMadeItinerary />
        </div>
      </div>
    </BrowserRouter>
  );
};


export default App;
