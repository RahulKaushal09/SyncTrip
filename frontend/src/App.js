import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import LoginPopup from './components/Popups/LoginPopup';
import FullProfilePopup from './components/Popups/FullProfilePopup';
import PhoneNumberPopup from './components/Popups/PhoneNumberPopup';
import { GoogleOAuthProvider } from '@react-oauth/google';
import EnrolledTripDetails from './pages/Trips/TripEnrolledDetails.js';
// import pageTypeEnum from './utils/pageType';

import { encryptData, decryptData } from './utils/securityStorage.js';

// import FullProfilePopup from './components/Popups/FullProfilePopup';
// import WeatherComponent from './data/getWeather';
// import TripForm from './components/upload/TripFormUpload';
// import { config } from "./config.js";


const App = () => {
  const [anyCtaPopup, setAnyCtaPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedLocations = useRef(false); // Prevent multiple API calls
  const [showLogin, setShowLogin] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState(null);
  const [locationsForPreMadeItinerary, setLocationsForPreMadeItinerary] = useState([]);
  // const [pageType, setPageType] = useState(PageTypeEnum?.HOME); // Added for page type


  useEffect(() => {
    if (localStorage.getItem('user')) {
      setUser(JSON.parse(localStorage.getItem('user')));
    }
  }, []);
  // Stabilize the handleIsLoading function reference
  const handleIsLoading = useCallback((value) => {
    setIsLoading(value);
  }, []);
  // Fetch Locations Only Once
  useEffect(() => {
    const fetchInitialLocations = async () => {
      const cacheKey = "cached_locations";
      const cacheExpiryKey = "cached_locations_expiry";

      const encryptedData = localStorage.getItem(cacheKey);
      const encryptedExpiry = localStorage.getItem(cacheExpiryKey);
      const now = new Date();

      if (encryptedData && encryptedExpiry) {
        const expiryDate = decryptData(encryptedExpiry);
        const parsedLocations = decryptData(encryptedData);

        if (expiryDate && new Date(expiryDate) > now && parsedLocations) {
          console.log("Using encrypted cached locations");
          setLocations(parsedLocations);
          setLocationsForPreMadeItinerary(parsedLocations);
          return;
        }
      }

      if (hasFetchedLocations.current) {
        console.log("Locations already fetched, skipping API call");
        return;
      }

      hasFetchedLocations.current = true;
      console.log("Fetching locations...");

      handleIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ limit: 100 }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        const locations = data.locations || data;

        setLocations(locations);
        setLocationsForPreMadeItinerary(locations);

        // Encrypt and store data with expiry (7 days)
        const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        localStorage.setItem(cacheKey, encryptData(locations));
        localStorage.setItem(cacheExpiryKey, encryptData(expiryDate.toISOString()));
      } catch (err) {
        setError(err.message);
      } finally {
        handleIsLoading(false);
        console.log("Fetch complete");
      }
    };

    fetchInitialLocations();
  }, [handleIsLoading, hasFetchedLocations]);

  // useEffect(() => {
  //   const path = window.location.pathname;

  //   if (path === `/${PageTypeEnum.TRIP}`) {
  //     setPageType(PageTypeEnum.TRIP);
  //   } else if (path === `/${PageTypeEnum.LOCATION}`) {
  //     setPageType(PageTypeEnum.LOCATION);
  //   } else {
  //     setPageType(PageTypeEnum.HOME);
  //   }
  // }, [window.location.pathname]);

  const handleLogin = (user, requiresPhone = false) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    if (!user.phone) {
      requiresPhone = true; // If phone is not set, we need to ask for it
    }
    if (requiresPhone) {
      setShowPhoneNumber(true); // Show phone number popup for Google login
    } else if (!user.profileCompleted) {
      setShowFullProfile(true); // Show full profile popup for manual login
    }
  };

  const handlePhoneSubmit = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setShowPhoneNumber(false);
    if (!updatedUser.profileCompleted) {
      setShowFullProfile(true);
    }
  };
  const decideLoginStatePopup = () => {
    if (user) {
      if (!user.phone) {
        setShowPhoneNumber(true);
      } else if (!user.profileCompleted) {
        setShowFullProfile(true);
      }
    } else {
      setShowLogin(true);
    }
  };


  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div>


          {showLogin && (
            <LoginPopup
              onClose={() => setShowLogin(false)}
              onLogin={handleLogin}
            />
          )}

          {showPhoneNumber && (
            <PhoneNumberPopup
              user={user}
              onClose={() => setShowPhoneNumber(false)}
              onPhoneSubmit={handlePhoneSubmit}
            />
          )}

          {showFullProfile && (
            <FullProfilePopup
              user={user}
              locations={locations}
              onClose={() => setShowFullProfile(false)}
              onProfileComplete={(updatedUser) => {
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setShowFullProfile(false);
              }}
            />
          )}
          <div className="App">
            {/* <WeatherComponent locationQuery="manali" /> */}
            {/* Always render Navbar */}
            <Navbar
              ctaAction={() => setAnyCtaPopup(true)}
              onLoginClick={() => setShowLogin(true)}
              user={user}
            // pageType={pageType} // Pass the page type to Navbar
            />
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
                    locations={locations}
                    locationsForPreMadeItinerary={locationsForPreMadeItinerary}
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
                path="/trips/:tripId"
                element={<TripsDetialsPage onLoginClick={() => decideLoginStatePopup()} ctaAction={() => setAnyCtaPopup(true)} handleIsLoading={handleIsLoading} />}
              />
              {/* enrolled Trip */}
              <Route
                path="/trips/en/:tripId"
                element={<EnrolledTripDetails />}
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
      </GoogleOAuthProvider >
    </BrowserRouter >

  );
};

export default App;