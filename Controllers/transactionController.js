const asyncHandler = require('express-async-handler');
const transactionModel = require("../Models/transactionModel")
const {createTransactionSession, deleteUnConfirmedTransactions} = require("../Services/transactionService");
const {getAllDocuments, getDocumentById, updateDocument, softDeleteDocument} = require("./Base/baseController");
const responseFormatter = require('../ResponseFormatter/responseFormatter');

// @desc    Allow to show Confirmed Transactions Only
// @route   No
// @access  No
exports.allowIsConfirmedTransactionsOnly = (request, response, next) => {
	request.query.isConfirmed = true;
	next();
}

// @desc    Get All Transactions
// @route   GET /transaction
// @access  Private
const searchFields = ['user', 'amount', 'paymentMethod', 'isTransferred'];
exports.getAllTransactions = getAllDocuments(transactionModel, 'Transactions', ...searchFields);

// @desc    Get transaction by ID
// @route   GET transaction/:id
// @access  Private
exports.getTransactionById = getDocumentById(transactionModel, 'Transaction');

// @desc    Create transaction
// @route   POST /transaction
// @access  Private
exports.addTransaction = asyncHandler(async (request, response, next) => {
	if(request.body.isConfirmed) {
		delete request.body.isConfirmed;
	}
	if(request.body.isTransferred) {
		delete request.body.isTransferred;
	}
	const createdTransaction = await transactionModel.create(request.body);
	const createdSession = await createTransactionSession(createdTransaction._id, request.body.amount);
	deleteUnConfirmedTransactions(createdTransaction._id);
	response.status(201).json(responseFormatter(true, `Paypal payment session is created successfully`, [createdSession]));
});

// @desc    Update transaction
// @route   PATCH /transaction/:id
// @access  Private
const fieldsThatAllowToUpdate = ['paymentMethod', 'paymentMethodRequirements'];
exports.updateTransaction = updateDocument(transactionModel, 'Transaction', ...fieldsThatAllowToUpdate);

// @desc    Delete transaction
// @route   DELETE /transaction/:id
// @access  Private
exports.deleteTransaction = softDeleteDocument(transactionModel, 'Transaction');
