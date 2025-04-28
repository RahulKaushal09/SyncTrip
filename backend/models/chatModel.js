const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true }, // Link chat to a specific trip
        isGroupChat: { type: Boolean, default: false }, // Support one-on-one chats (default) or group chats
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // Users in the chat
        latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Reference to the latest message
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional, for group chats
        chatName: { type: String, trim: true }, // Optional, for group chats
    },
    { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;