const express = require("express");
const router = express.Router();
const {authentication, authorization} = require("../Services/authService");
const {idValidation} = require("../Middlewares/idValidation")
const {sendMessageValidation, replyOnMessageValidation} = require("../Middlewares/messageValidation")
const {getAllMessages, getMessageById, sendMessage, replyOnMessage, deleteMessage} = require("../Controllers/messageController");
const {ModelNames} = require('../enums/ModelPermissions');

router.route("/")
    .get(authentication, authorization(ModelNames.Messages), getAllMessages)
    .post(sendMessageValidation, sendMessage)

router.route("/:id")
    .all(authentication, authorization(ModelNames.Messages), idValidation)
    .get(getMessageById)
    .patch(replyOnMessageValidation, replyOnMessage)
    .delete(deleteMessage)

module.exports = router;