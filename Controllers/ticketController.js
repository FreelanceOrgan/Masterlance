const asyncHandler = require("express-async-handler")
const ticketModel = require("../Models/ticketModel");
const {getAllDocuments, getDocumentById, addDocument, hardDeleteDocument} = require("./Base/baseController");
const {sendEmail} = require("../Services/sendEmailService");
const APIError = require("../ErrorHandler/APIError");
const responseFormatter = require("../ResponseFormatter/responseFormatter");

const searchFields = ['title', 'description', 'sendBy', 'repliedBy'];
exports.getAllTickets = getAllDocuments(ticketModel, 'Tickets', ...searchFields);

exports.getTicketById = getDocumentById(ticketModel, 'Ticket');

exports.sendTicket = addDocument(ticketModel, 'Ticket');

exports.replyOnTicket = asyncHandler(async (request, response, next) => {
  const ticket = await ticketModel.findById(request.params.id);
  if(!ticket) {
    throw new APIError("This ticket is not found", 404);
  }
  await sendEmail({email: ticket.sendBy.email, subject: request.body.subject, message: request.body.reply});
  ticket.reply = request.body.reply;
  ticket.repliedBy = request.user.id;
  ticket.isReplied = true;
  await ticket.save();
  response.status(200).json(responseFormatter(true, "Your reply has been sent successfully", [ticket]));
});

exports.deleteTicket = hardDeleteDocument(ticketModel, 'Ticket');
