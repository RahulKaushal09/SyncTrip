import React, { useState, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/home';
import DestinationPage from './pages/Destination/Destination';
import Footer from './components/Footer/Footer';
import Trips from './pages/Trips/trips';
import AddNewTripPage from './pages/Trips/AddNewTrip';
import TripsDetialsPage from './pages/Trips/TripsDetails';
import PreRegisterPopup from './components/Popups/preRegisterPopup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import loader from './assets/images/loader.gif';
// import WeatherComponent from './data/getWeather';
// import TripForm from './components/upload/TripFormUpload';
// import { config } from "./config.js";


const App = () => {
  const [anyCtaPopup, setAnyCtaPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedLocations = useRef(false); // Prevent multiple API calls

  // Stabilize the handleIsLoading function reference
  const handleIsLoading = useCallback((value) => {
    setIsLoading(value);
  }, []);

  return (
    <BrowserRouter>
      <div>
        <div className="App">
          {/* <WeatherComponent locationQuery="manali" /> */}
          {/* Always render Navbar */}
          <Navbar ctaAction={() => setAnyCtaPopup(true)} />
          {/* <TripForm /> */}
          {/* Conditionally render Popup */}
          {anyCtaPopup && <PreRegisterPopup onClose={() => setAnyCtaPopup(false)} />}

          {/* Loading Overlay */}
          {isLoading && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                padding: "40%",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white', // Opaque white background
                zIndex: 9999,
              }}
            >
              <div><img src={loader}
                alt='Loading Please Wait!!'></img></div>
            </div>
          )}

          {/* Define Routes */}
          <Routes>
            {/* Redirect root "/" to "/home" */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Route for Home */}
            <Route
              path="/home"
              element={
                <Home
                  ctaAction={() => setAnyCtaPopup(true)}
                  handleIsLoading={handleIsLoading}
                  hasFetchedLocations={hasFetchedLocations}
                />
              }
            />

            {/* Route for DestinationPage with dynamic locationId */}
            <Route
              path="/location/:locationId"
              element={<DestinationPage ctaAction={() => setAnyCtaPopup(true)} handleIsLoading={handleIsLoading} />}
            />
            <Route
              path="/trips"
              element={<Trips ctaAction={() => setAnyCtaPopup(true)} handleIsLoading={handleIsLoading} />}
            />
            <Route
              path="/AddNewtrips"
              element={<AddNewTripPage />}
            />
            <Route
              path="/trips/:locationId"
              element={<TripsDetialsPage ctaAction={() => setAnyCtaPopup(true)} handleIsLoading={handleIsLoading} />}
            />

            {/* Optional: Catch-all route for 404 */}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>

        </div>
        {/* Always render Footer */}
        <Footer
          links={{
            company: [
              { name: 'About', url: '/about' },
              { name: 'How It Works', url: '/how-it-works' },
              { name: 'Blog', url: '/blog' },
            ],
          }}
        />
      </div>
    </BrowserRouter >

  );
};

export default App;