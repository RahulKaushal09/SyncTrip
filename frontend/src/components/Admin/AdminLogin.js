import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader/loader';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();
  useEffect(() => {
    const checkAdminStatus = async () => {
      const token = localStorage.getItem('userToken');
      setUser(JSON.parse(localStorage.getItem("user")));
      if (!token) {
        setIsLoading(false);
        return;
      }
      if (user && user.isAdmin) {
        navigate('/admin/Trips/Dashboard');
        return;
      }


      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user profile');
        }

        if (data.isAdmin) {
          toast.success('Already logged in as admin');
          navigate('/admin/Trips/Dashboard');
        } else {
          throw new Error('User is not an admin');
        }
      } catch (err) {
        setError('Please log in with admin credentials');
        toast.error(err.message);
        localStorage.removeItem('user');
        localStorage.removeItem('userToken');
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/users/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('userToken', data.token);
      toast.success('Logged in successfully!');
      navigate('/admin/Trips/Dashboard');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <Loader setLoadingState={isLoading} TextToShow="Logging in..." />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-login-container">
      <div className="admin-dashboard-login-card">
        <h2 className="admin-dashboard-heading">Admin Login</h2>
        {error && <p className="admin-dashboard-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="admin-dashboard-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;