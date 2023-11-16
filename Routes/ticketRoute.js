const express = require("express");
const router = express.Router();
const {authentication, authorization, allowFreelancerRoleOnly, preventFreelancerRole} = require("../Services/authService");
const {addLoginUserIdToRequestBody, addLoginUserIdToRequestQuery} = require("../Shared/addToRequest");
const {idValidation} = require("../Middlewares/idValidation")
const {sendTicketValidation, replyOnTicketValidation} = require("../Middlewares/ticketValidation")
const {getAllTickets, getTicketById, sendTicket, replyOnTicket, deleteTicket} = require("../Controllers/ticketController");
const {ModelNames} = require('../enums/ModelPermissions');

router.route("/")
	.get(authentication, authorization(ModelNames.Tickets), addLoginUserIdToRequestQuery('sendBy'), getAllTickets)
	.post(authentication, authorization(ModelNames.Tickets), allowFreelancerRoleOnly, addLoginUserIdToRequestBody('sendBy'), sendTicketValidation, sendTicket)

router.route("/:id")
	.all(authentication, authorization(ModelNames.Tickets), idValidation)
	.get(getTicketById)
	.patch(preventFreelancerRole, replyOnTicketValidation, replyOnTicket)
	.delete(preventFreelancerRole, deleteTicket)

module.exports = router;