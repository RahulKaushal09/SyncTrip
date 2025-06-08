import React from 'react';
import AdminTripDetails from '../../components/Admin/TripDetailsAdmin';

const AdminTripDetailsPage = () => {
    return (
        <div className="admin-trips-dashboard">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <h1 className="admin-dashboard-heading">Trip Details</h1>
                        <p className="text-center mb-4">
                            Manage trip details and enrolled users below.
                        </p>
                        <AdminTripDetails />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTripDetailsPage;