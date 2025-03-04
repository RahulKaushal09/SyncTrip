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
// import FestivalsEvents from './components/FestivalEventSection/festivalsEvents';
// import ExploreSection from './components/Explore/ExploreSection';
// import TrendingSection from './components/TrendingSection/TrendingSection';
// import TopDestitnations from './components/TopDestitnations/TopDestitnations';
// import SyncTripAppPushingSection from './components/AppPushingSection/AppPushingSection';
import Home from './pages/Home/home';
import Footer from './components/Footer/Footer';
import LocationEventsDetails from './components/Details/locationEventsDetials';
import LocationImageGallery from './components/Details/locationImages';
const App = () => {

  return (
    <BrowserRouter>
      <div>
        <div className="App">
          <Navbar />
          <div style={{ margin: "0px 40px" }}>
            {/* <MainSearchBar />
            <ExploreSection />

            <PreMadeItinerary />
            <FestivalsEvents />
            <TrendingSection />
            <TopDestitnations />
            <SyncTripAppPushingSection /> */}
            {/* <Home /> */}
            <LocationEventsDetails type={"Explore"} location={"Manali"} title={"Manali snowfall"} rating="4.6" country={"India"} />
            <LocationImageGallery />
          </div>
        </div>
        <Footer
          links={{
            company: [
              { name: 'About', url: '/about' },
              { name: 'How It Works', url: '/how-it-works' },
              { name: 'Blog', url: '/blog' },
            ],
            // Add other sections as needed
          }}
        />
      </div>
    </BrowserRouter>
  );
};


export default App;
