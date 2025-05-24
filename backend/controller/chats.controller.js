const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// @description     Create or fetch a one-to-one chat for a specific trip
// @route           POST /api/chats
// @access          Protected
const accessChat = asyncHandler(async (req, res) => {
    const { userId, tripId } = req.body;
    //here userId is the friend with whom the user wants to chat and tripId is the trip for which the user wants to chat with that friend
    // Validate input
    if (!userId || !tripId) {
        return res.status(400).json({ message: "userId and tripId are required" });
    }

    // Validate that users are friends for the trip (status: 0)
    const user = await User.findOne({
        _id: req.user._id,
        "friends.tripId": tripId,
        "friends.users": {
            $elemMatch: { userId, status: 0 },
        },
    });

    if (!user) {
        return res.status(403).json({ message: "Users are not friends for this trip" });
    }

    // Check for existing chat
    let chat = await Chat.findOne({
        isGroupChat: false,
        tripId,
        users: { $all: [req.user._id, userId], $size: 2 },
    })
        .populate("users", "name email profile_picture")
        .populate("latestMessage");

    if (chat) {
        chat = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "name email profile_picture",
        });
        return res.status(200).json(chat);
    }

    // Create new chat
    const chatData = {
        tripId,
        isGroupChat: false,
        users: [req.user._id, userId],
        chatName: "sender",
    };

    try {
        const createdChat = await Chat.create(chatData);

        // Update chatHistoryId in both users' friends arrays
        await User.updateOne(
            {
                _id: req.user._id,
                "friends.tripId": tripId,
                "friends.users.userId": userId,
            },
            {
                $set: { "friends.$[trip].users.$[user].chatHistoryId": createdChat._id },
            },
            {
                arrayFilters: [
                    { "trip.tripId": tripId },
                    { "user.userId": userId },
                ],
            }
        );

        await User.updateOne(
            {
                _id: userId,
                "friends.tripId": tripId,
                "friends.users.userId": req.user._id,
            },
            {
                $set: { "friends.$[trip].users.$[user].chatHistoryId": createdChat._id },
            },
            {
                arrayFilters: [
                    { "trip.tripId": tripId },
                    { "user.userId": req.user._id },
                ],
            }
        );

        // Fetch the full chat with populated fields
        const fullChat = await Chat.findOne({ _id: createdChat._id })
            .populate("users", "name email profile_picture")
            .populate("latestMessage");

        res.status(200).json(fullChat);
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to create chat: ${error.message}`);
    }
});

// @description     Fetch all chats for a user, optionally filtered by tripId
// @route           GET /api/chats?tripId=optional_trip_id
// @access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    const { tripId } = req.query;

    try {
        // Build query
        let query = { users: { $elemMatch: { $eq: req.user._id } } };
        if (tripId) {
            query.tripId = tripId;
        }

        // Fetch chats with populated fields
        let chats = await Chat.find(query)
            .populate("users", "name email profile_picture")
            .populate("tripId", "name") // Assuming Trip model has a 'name' field
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        console.log(chats);
        // Populate sender of latest message
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name email profile_picture",
        });
        console.log("chats after populating latestMessage.sender", chats);

        res.status(200).json(chats);
    } catch (error) {
        res.status(500);
        throw new Error(`Failed to fetch chats: ${error.message}`);
    }
});
// // @desc    Rename Group
// // @route   PUT /api/chat/rename
// // @access  Protected
// const renameGroup = asyncHandler(async (req, res) => {
//   const { chatId, chatName } = req.body;

//   const updatedChat = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       chatName: chatName,
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!updatedChat) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(updatedChat);
//   }
// });

// // @desc    Remove user from Group
// // @route   PUT /api/chat/groupremove
// // @access  Protected
// const removeFromGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   // check if the requester is admin

//   const removed = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $pull: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!removed) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(removed);
//   }
// });

// // @desc    Add user to Group / Leave
// // @route   PUT /api/chat/groupadd
// // @access  Protected
// const addToGroup = asyncHandler(async (req, res) => {
//   const { chatId, userId } = req.body;

//   // check if the requester is admin

//   const added = await Chat.findByIdAndUpdate(
//     chatId,
//     {
//       $push: { users: userId },
//     },
//     {
//       new: true,
//     }
//   )
//     .populate("users", "-password")
//     .populate("groupAdmin", "-password");

//   if (!added) {
//     res.status(404);
//     throw new Error("Chat Not Found");
//   } else {
//     res.json(added);
//   }
// });

module.exports = { accessChat, fetchChats };