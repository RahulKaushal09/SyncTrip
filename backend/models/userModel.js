const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rating: { type: Number, default: 5 },
    sex: { type: String, required: true },
    profile_picture: [{ type: String, required: true }],
    persona: [String],
    preferred_destinations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    trips: [{
        status: { type: String, enum: ['ongoing', 'completed'], required: true },
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
        bookingDate: Date,
    }],
    showProfile: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],
    matched: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
        chatHistoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory' },
        status: { type: String, enum: ['accepted', 'rejected'], required: true },
    }],
    requested: [{
        // tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        trips: [
            {
                tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
                type: { type: String, enum: ['sent', 'received'], required: true },
                status: { type: String, enum: ['pending', 'accepted', 'rejected'], required: true },
            }
        ],
    }],
    blocked: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },


}, { timestamps: true });





module.exports = mongoose.model('User', UserSchema);
