const asyncHandler = require("express-async-handler");
const Message = require("../models/messagesModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

// @description     Send a new message in a chat
// @route           POST /api/messages
// @access          Protected
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    // Validate input
    if (!content || !content.trim() || !chatId) {
        return res.status(400).json({ message: "chatId and non-empty content are required" });
    }

    // Verify user is part of the chat
    const chat = await Chat.findOne({
        _id: chatId,
        users: { $elemMatch: { $eq: req.user._id } },
    });

    if (!chat) {
        return res.status(403).json({ message: "User not authorized for this chat" });
    }

    try {
        // Create new message
        let message = await Message.create({
            chat: chatId,
            sender: req.user._id,
            content: content.trim(),
            readBy: [req.user._id], // Sender has read their own message
        });

        // Populate sender details
        message = await message.populate("sender", "name profile_picture");

        // Update chat's latestMessage
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

        // Emit Socket.IO event to chat room
        if (req.io) {
            req.io.to(chatId).emit("receive_message", message);
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to send message: ${error.message}`);
    }
});

// @description     Get all messages for a chat
// @route           GET /api/messages/:chatId
// @access          Protected
const allMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    // Verify user is part of the chat
    const chat = await Chat.findOne({
        _id: chatId,
        users: { $elemMatch: { $eq: req.user._id } },
    });

    if (!chat) {
        return res.status(403).json({ message: "User not authorized for this chat" });
    }

    try {
        // Fetch messages
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name profile_picture")
            .sort({ createdAt: 1 }); // Chronological order

        // Mark messages as read
        await Message.updateMany(
            { chat: chatId, readBy: { $ne: req.user._id } },
            { $addToSet: { readBy: req.user._id } }
        );

        res.status(200).json(messages);
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to fetch messages: ${error.message}`);
    }
});

module.exports = { sendMessage, allMessages };