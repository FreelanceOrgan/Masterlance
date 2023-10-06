const asyncHandler = require("express-async-handler")
const messageModel = require("../Models/messageModel");
const {getAllDocuments, getDocumentById, addDocument, hardDeleteDocument} = require("./Base/baseController");
const {sendEmail} = require("../Services/sendEmailService");
const APIError = require("../ErrorHandler/APIError");
const responseFormatter = require("../ResponseFormatter/responseFormatter");

// @desc    Get All messages
// @route   GET /message
// @access  Private
const searchFields = ['name', 'email', 'repliedBy'];
exports.getAllMessages = getAllDocuments(messageModel, 'Messages', ...searchFields);

// @desc    Get message by ID
// @route   GET message/:id
// @access  Private
exports.getMessageById = getDocumentById(messageModel, 'Message');

// @desc    Create message
// @route   POST /message
// @access  Private
exports.sendMessage = addDocument(messageModel, 'Message');

// @desc    Update message
// @route   PATCH /message/:id
// @access  Private
exports.replyOnMessage = asyncHandler(async (request, response, next) => {
  const message = await messageModel.findById(request.params.id);
  if(!message) {
    throw new APIError("This message is not found", 404);
  }
  await sendEmail({email: message.email, subject: request.body.subject, message: request.body.reply});
  message.reply = request.body.reply;
  message.repliedBy = request.user.id;
  await message.save();
  response.status(200).json(responseFormatter(true, "Your reply has been sent successfully", [message]));
})

// @desc    Delete message
// @route   DELETE /message/:id
// @access  Private
exports.deleteMessage = hardDeleteDocument(messageModel, 'Message');
