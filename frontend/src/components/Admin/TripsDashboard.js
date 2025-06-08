import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import TripCard from '../Trips/TripCard';
import Loader from '../Loader/loader';

function AdminTripsDashboard() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/trips`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch trips');
        }

        setTrips(data.trips || []);
        setError('');
      } catch (err) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/trips`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setError(err.message);
        toast.error(err.message);
        if (response && (response.status === 401 || response.status === 403)) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('user');
          navigate('/admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loader-container">
        <Loader setLoadingState={isLoading} TextToShow="Loading trips..." />
      </div>
    );
  }

  if (error) {
    return <div className="admin-dashboard-status-message admin-dashboard-error-message">{error}</div>;
  }

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-dashboard-heading">Admin Trips Dashboard</h2>
      {trips.length === 0 ? (
        <p className="admin-dashboard-status-message">No trips available.</p>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {trips.map((trip) => (
            <div key={trip._id} className="col">
              <TripCard trip={trip} activeTab="admin" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminTripsDashboard;