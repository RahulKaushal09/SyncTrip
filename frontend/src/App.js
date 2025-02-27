import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import MainSearchBar from './components/SearchPanel/MainSeachBar';
// import LocationCard from './components/LocationCard/LocationCard';
import Navbar from './components/Navbar/Navbar';
// import locations from './data/locations.json'; // Import the JSON file
import PreMadeItinerary from './components/preItinearies/PreMadeItinerary';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter } from 'react-router-dom';
import FestivalsEvents from './components/FestivalEventSection/festivalsEvents';
import ExploreSection from './components/Explore/ExploreSection';
import TrendingSection from './components/TrendingSection/TrendingSection';
const App = () => {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div style={{ margin: "0px 40px" }}>
          <MainSearchBar />
          <ExploreSection />

          <PreMadeItinerary />
          <FestivalsEvents />
          <TrendingSection />
        </div>
      </div>
    </BrowserRouter>
  );
};


export default App;
