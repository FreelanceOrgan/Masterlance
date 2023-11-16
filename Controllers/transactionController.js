const asyncHandler = require('express-async-handler');
const transactionModel = require("../Models/transactionModel")
const {createTransactionSession, deleteUnConfirmedTransactions} = require("../Services/transactionService");
const {getAllDocuments, getDocumentById, updateDocument, softDeleteDocument} = require("./Base/baseController");
const responseFormatter = require('../ResponseFormatter/responseFormatter');

exports.allowIsConfirmedTransactionsOnly = (request, response, next) => {
	request.query.isConfirmed = true;
	next();
}

const searchFields = ['user', 'amount', 'paymentMethod', 'isTransferred'];
exports.getAllTransactions = getAllDocuments(transactionModel, 'Transactions', ...searchFields);

exports.getTransactionById = getDocumentById(transactionModel, 'Transaction');

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

const allowedFieldsToUpdate = ['paymentMethod', 'paymentMethodRequirements'];
exports.updateTransaction = updateDocument(transactionModel, 'Transaction', ...allowedFieldsToUpdate);

exports.deleteTransaction = softDeleteDocument(transactionModel, 'Transaction');
