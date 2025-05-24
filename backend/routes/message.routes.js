// const express = require("express");
// const {
//     allMessages,
//     sendMessage,
// } = require("../controller/message_old.controller");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.route("/:chatId").get(protect, allMessages);
// router.route("/").post(protect, sendMessage);

// module.exports = router;
const express = require("express");
const { allMessages, sendMessage } = require("../controller/message.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;