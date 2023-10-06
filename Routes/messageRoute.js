const express = require("express");

const router = express.Router();
const {authentication, authorization} = require("../Services/authService");
const {idValidation} = require("../Middlewares/idValidation")
const {sendMessageValidation, replyOnMessageValidation} = require("../Middlewares/messageValidation")
const {getAllMessages, getMessageById, sendMessage, replyOnMessage, deleteMessage} = require("../Controllers/messageController");

router.route("/")
    .get(authentication, authorization("messages"), getAllMessages)
    .post(sendMessageValidation, sendMessage)

router.route("/:id")
    .all(authentication, authorization("messages"), idValidation)
    .get(getMessageById)
    .patch(replyOnMessageValidation, replyOnMessage)
    .delete(deleteMessage)

module.exports = router;