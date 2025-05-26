const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true }, // Not required initially for Google login
    password: { type: String }, // Not required for Google login
    rating: { type: Number, default: 5 },
    sex: { type: String }, // Not required initially for Google login
    dateOfBirth: { type: Date }, // New field to calculate age
    profile_picture: [{ type: String }], // Optional initially
    interestedAgeGroups: [{ type: String }], // e.g., ["18-25", "25-35"]
    interestedSex: [{ type: String }], // e.g., ["Male", "Female", "Any"]
    languages: [{ type: String }],
    persona: [String], // Travel styles and traveler types
    preferred_destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    trips: [{
        status: { type: String, enum: ['ongoing', 'completed'], required: true },
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
        bookingDate: Date,
        startDate: Date,
        endDate: Date,
        slotId: {
            type: Number,
            required: true
        },
    }],
    showProfile: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    friends: [{
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
        users: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                status: { type: Number, enum: [-1, 0, 1], required: true },// considering -1 => incoming request 0 => matched 1 => requested to the user
                // chatHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory' },
                chatHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // References Chat model
            }
        ]
    }],
    // matched: [{
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    //     chatHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory' },
    //     status: { type: String, enum: ['accepted', 'rejected'], required: true },
    // }],
    // requested: [{
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     trips: [{
    //         tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    //         type: { type: String, enum: ['sent', 'received'], required: true },
    //         status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true },
    //     }],
    // }],
    // recievedReq: [{
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     trips: [{
    //         tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    //         type: { type: String, enum: ['sent', 'received'], required: true },
    //         status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true },
    //     }],
    // }],
    profileCompleted: { type: Boolean, default: false },
    socialMedias: {
        instagram: { type: String, default: '' },
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
    },
    travelGoal: { type: String }, // New field
    // blocked: [{
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //     tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    // }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    views: [{ // New field to track profile views
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

// Virtual field to calculate age from dateOfBirth
UserSchema.virtual('age').get(function () {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});

UserSchema.set('toJSON', { virtuals: true }); // Include virtuals in JSON output

module.exports = mongoose.model('User', UserSchema);