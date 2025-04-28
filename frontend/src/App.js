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
// import loader from './assets/images/loader.gif';
import Loader from './components/Loader/loader.js';
import LoginPopup from './components/Popups/LoginPopup';
import FullProfilePopup from './components/Popups/FullProfilePopup';
import PhoneNumberPopup from './components/Popups/PhoneNumberPopup';
import { GoogleOAuthProvider } from '@react-oauth/google';
import EnrolledTripDetails from './pages/Trips/TripEnrolledDetails.js';
// import pageTypeEnum from './utils/pageType';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

import { encryptData, decryptData } from './utils/securityStorage.js';
import { fetchLocations, mergeLocationsIntoCache, getLimitByDevice } from './utils/CommonServices.js';

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
  const [locationsForPreMadeItinerary, setLocationsForPreMadeItinerary] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = getLimitByDevice();
  // const { pathname } = useLocation(); // ⬅️ gets current path
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
  // if /home page only then run this code
  useEffect(() => {
    // if (pathname !== '/home' && pathname !== '/') return; // ⬅️ only run on /home or /

    const loadInitial = async () => {
      const now = new Date();
      const encrypted = localStorage.getItem(process.env.REACT_APP_CACHE_KEY || 'cached_locations');
      const expiryEncrypted = localStorage.getItem(process.env.REACT_APP_CACHE_EXPIRY_KEY || 'cached_locations_expiry');

      if (encrypted && expiryEncrypted) {
        const expiry = decryptData(expiryEncrypted);
        if (expiry && new Date(expiry) > now) {
          const cached = decryptData(encrypted);
          if (cached?.length) {
            setLocations(cached.slice(0, limit));
            setLocationsForPreMadeItinerary(cached);
            setSkip(limit);
            return;
          }
        }
      }

      const data = await fetchLocations(0, limit);
      const updatedCache = mergeLocationsIntoCache(data.locations || data);
      setLocations(updatedCache.slice(0, limit));
      setLocationsForPreMadeItinerary(updatedCache.slice(0, limit));
      setSkip(limit);
    };

    loadInitial();
  }, []);
  const handleShowMoreHome = async () => {
    try {
      const result = await fetchLocations(skip, limit);

      const updatedCache = mergeLocationsIntoCache(result.locations); // updates localStorage uniquely

      const nextSlice = updatedCache.slice(0, skip + limit);
      setLocations(nextSlice);
      setSkip(skip + limit);
      setHasMore(result.hasMore); // only used when API is hit, but still safe to assign
    } catch (err) {
      console.error("Error loading more:", err);
    }
  };

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
    else {
      window.location.reload(); // Reload the page to reflect the changes
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
        <Toaster position="top-right" reverseOrder={false} />

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
              // locations={locations}
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
                <Loader setLoadingState={isLoading} />
                {/* <div><img src={loader}
                  alt='Loading Please Wait!!'></img></div> */}
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
                    // handleIsLoading={handleIsLoading}
                    // hasFetchedLocations={hasFetchedLocations}
                    handleShowMoreHome={handleShowMoreHome}
                    setLocations={setLocations}
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