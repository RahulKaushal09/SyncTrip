import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { userId } = useParams(); // Extracting userId from the URL parameters
    console.log(`User ID: ${userId}`); // Logging the userId to the console

    return (
        <div>
            <h1>User Profile</h1>
            <p>This is the user profile page.</p>
        </div>
    );
}
export default UserProfile;