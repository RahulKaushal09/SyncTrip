import React from 'react';
import AdminLogin from '../../components/Admin/AdminLogin';

const AdminLoginPage = () => {
    return (
        <div className="admin-login-page">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-6">
                        <h1 className="admin-dashboard-heading">Admin Login</h1>
                        <p className="text-center mb-4">
                            Please enter your credentials to access the admin dashboard.
                        </p>
                        <AdminLogin />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;