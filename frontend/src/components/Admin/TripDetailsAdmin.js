import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from '../Loader/loader';
import ProfileCardUi from '../Profile/ProfileCard';
import { ProfileCardEnum } from '../../utils/EnumClasses';

function AdminTripDetails() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [appliedUsers, setAppliedUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [remarkInputs, setRemarkInputs] = useState({});
    const navigate = useNavigate();

    // Format date function from TripCard.js
    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const year = d.getFullYear();
        const monthName = d.toLocaleString('en-GB', { month: 'long' });
        return `${day} ${monthName}, ${year}`;
    };

    useEffect(() => {
        const fetchTripDetails = async () => {
            const token = localStorage.getItem('userToken');
            const user = localStorage.getItem('user');
            if (!token) {
                navigate('/admin/login');
                return;
            }
            if (!user || !JSON.parse(user).isAdmin) {
                toast.error('You are not authorized to view this page');
                navigate('/admin/login');
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/trip/${tripId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch trip details');
                }

                setTrip(data.trip);
                setAppliedUsers(data.appliedUsers || []);
                setError('');
            } catch (err) {
                setError(err.message);
                toast.error(err.message);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('user');
                    navigate('/admin/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchTripDetails();
    }, [tripId, navigate]);

    const handleRemarkChange = (userId, value) => {
        setRemarkInputs((prev) => ({ ...prev, [userId]: value }));
    };

    const handleRemarkSubmit = async (userId) => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/admin/trip/${tripId}/user/${userId}/remark`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ remark: remarkInputs[userId] || '' }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update remark');
            }

            setAppliedUsers((prev) =>
                prev.map((user) =>
                    user._id === userId ? { ...user, remark: remarkInputs[userId] || '' } : user
                )
            );
            toast.success('Remark updated successfully');
        } catch (err) {
            toast.error(err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="loader-container">
                <Loader setLoadingState={isLoading} TextToShow="Loading trip details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-status-message admin-dashboard-error">
                {error}
            </div>
        );
    }

    return (
        <div className="admin-container">
            <div className="row mb-5">
                <div className="col-md-6">
                    <img
                        src={trip.MainImageUrl || 'https://via.placeholder.com/300'}
                        alt={trip.title}
                        className="img-fluid rounded admin-dashboard-img"
                    />
                </div>
                <div className="col-md-6">
                    <h3 className="admin-subheader">{trip.title}</h3>
                    <p className="admin-details-text">Status: <span className="status-text">{trip.requirements?.status || 'Unknown'}</span></p>
                    <p className="admin-details-text">Enrolled: <span>{trip.numberOfPeopleApplied || 0}</span></p>
                    <p className="admin-details-text">Price: <span>{trip.essentials?.Price ? `₹${trip.essentials.Price}` : 'N/A'}</span></p>
                    <p className="admin-details-text">Dates:</p>
                    {trip.essentials?.timelines?.length > 1 ? (
                        <div>
                            <span>Multiple Dates</span>
                            <ul className="list-group list-group-flush admin-flush-list">
                                {trip.essentials.timelines.map((timeline, index) => (
                                    <li key={timeline.slotId || index} className="list-group-item">
                                        {formatDate(timeline.fromDate)} - {formatDate(timeline.tillDate)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : trip.essentials?.timelines?.[0] ? (
                        <span>
                            {formatDate(trip.essentials.timelines[0].fromDate)} -{' '}
                            {formatDate(trip.essentials.timelines[0].tillDate)}
                        </span>
                    ) : (
                        <span>N/A</span>
                    )}
                </div>
            </div>
            <h3 className="admin-section-header">Enrolled Friends</h3>
            {appliedUsers.length === 0 ? (
                <p className="admin-text-center">No users enrolled.</p>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                    {appliedUsers.map((user) => (
                        <div key={user._id} className="col">
                            <div className="admin-card">
                                <ProfileCardUi
                                    user={user}
                                    type={ProfileCardEnum.AllGoing}
                                    showviewProfile={false}
                                    profileCardInlineStyle={{}}
                                />
                                <div className="mt-2">
                                    <h5 className="admin-card-title-sm">Friend Connections</h5>
                                    {user.friends && user.friends.length > 0 ? (
                                        <ul className="list-group list-group-flush admin-flush-list">
                                            {user.friends.map((friend, index) => (
                                                <li key={friend.userId || index} className="list-group-item">
                                                    Name: {friend.name || 'Unknown'} (Status:{' '}
                                                    {friend.status === 0
                                                        ? 'Matched'
                                                        : friend.status === 1
                                                            ? 'Requested'
                                                            : 'Incoming Request'})
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="admin-text-sm">No friend connections</p>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <h5 className="admin-card-title-sm">Enrollment Dates</h5>
                                    <p className="admin-text-sm">
                                        {user.startDate && user.endDate
                                            ? `${formatDate(user.startDate)} - ${formatDate(user.endDate)}`
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor={`remark-${user._id}`} className="admin-label">
                                        Remark
                                    </label>
                                    <textarea
                                        id={`remark-${user._id}`}
                                        value={remarkInputs[user._id] ?? user.remark ?? ''}
                                        onChange={(e) => handleRemarkChange(user._id, e.target.value)}
                                        className="admin-textarea"
                                        rows="4"
                                        placeholder="Add a remark for this user's enrollment"
                                    />
                                    <button
                                        onClick={() => handleRemarkSubmit(user._id)}
                                        className="admin-button mt-2"
                                    >
                                        Save Remark
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminTripDetails;