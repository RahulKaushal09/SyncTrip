import React from 'react';
import '../../styles/Profile/ProfileCardUI.css'; // Create this CSS file for styling
import { FaStar } from 'react-icons/fa';
import { ProfileCardEnum } from '../../utils/EnumClasses';
const ProfileCardUi = ({ user, instagramSocialMedia, onViewProfile, hasSentRequest, isConnected, type, btns }) => {
    const { name, profilePicture, age, rating, persona, interestedAgeGroups, _id } = user;
    // const handle = `@${name.toLowerCase().replace(/\s/g, '')}`; // Simplified handle generation
    // const bio = "If you like my work, consider supporting me on PayPal and help me make a dream come true.";
    // const views = 74.3; // Example value
    // const rank = 17;    // Example value
    // const downloads = 45; // Example value
    const handle = instagramSocialMedia || "";

    return (
        <div className="profile-card">
            <img src={profilePicture || 'default-profile.png'} alt={name} className="profile-picture" />
            <div className="profile-info">
                <div className="profile-header">
                    <h3 className="profile-name">{name}</h3>
                    {handle && <span className="profile-handle">{handle}</span>}
                </div>
                {/* <p className="profile-bio">{bio}</p> */}
                <div className="profile-stats">
                    <span className="stat-item">Age: {age}</span>
                    <span className="stat-item">Rating: {rating} {FaStar}</span>
                    <span className="stat-item">Persona: {persona}M</span>
                </div>
                <div className="profile-actions">
                    {type === ProfileCardEnum.RecivedRequests && (
                        <>
                            <div style={{ display: "flex", gap: "10px" }}>
                                {btns &&
                                    btns.map((btn, index) => (
                                        <button
                                            key={index}
                                            className={btn.className ? btn.className + " action-btn" : "action-btn"}
                                            onClick={btn.onClick}
                                            style={btn.inlineStyle}
                                        >
                                            {btn.text}
                                        </button>
                                    ))}
                            </div>
                            <button className="action-btn view-btn" onClick={() => onViewProfile(_id)}>
                                View Profile
                            </button>
                        </>
                    )}

                    {type === ProfileCardEnum.AllGoing && (
                        // if isConnected then show Connected 
                        // else show Requested

                        hasSentRequest ? (
                            <span className="requested-text">{isConnected ? "Connected" : "Requested"}</span>
                            // <span className="requested-text">Requested</span>
                        ) : (
                            <>
                                {btns &&
                                    btns.map((btn, index) => (
                                        <button
                                            key={index}
                                            className={btn.className ? btn.className + " action-btn" : "action-btn"}
                                            onClick={btn.onClick}

                                        >
                                            {btn.text}
                                        </button>
                                    ))}
                                <button className="action-btn view-btn" onClick={() => onViewProfile(_id)}>
                                    View Profile
                                </button>
                            </>
                        )
                    )}
                    {type === ProfileCardEnum.Connection && (
                        <>
                            {btns &&
                                btns.map((btn, index) => (
                                    <button
                                        key={index}
                                        className={btn.className ? btn.className + " " : "btn btn-black"}
                                        onClick={btn.onClick}

                                    >
                                        {btn.text}
                                    </button>
                                ))}
                            <button className="action-btn view-btn" onClick={() => onViewProfile(_id)}>
                                View Profile
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div >
    );
};

export default ProfileCardUi;