const transactionModel = require("../Models/transactionModel")
const {getAllDocuments, getDocumentById, addDocument, updateDocument, softDeleteDocument} = require("./Base/baseController");

// @desc    Get All Transactions
// @route   GET /transaction
// @access  Private
const searchFields = ['userId', 'amount', 'paymentMethod'];
exports.getAllTransactions = getAllDocuments(transactionModel, 'Transactions', ...searchFields);

// @desc    Get transaction by ID
// @route   GET transaction/:id
// @access  Private
exports.getTransactionById = getDocumentById(transactionModel, 'Transaction');

// @desc    Remove isConfirmed property from the body of the request during add new transaction
// @route   No
// @access  No
exports.removeIsConfirmedIfItSend = (request, response, next) =>{
    if(request.body.isConfirmed) {
        delete request.body.isConfirmed;
    }
    next();
}

// @desc    Create transaction
// @route   POST /transaction
// @access  Private
exports.addTransaction = addDocument(transactionModel, 'Transaction');

// @desc    Update transaction
// @route   PATCH /transaction/:id
// @access  Private
const fieldsThatAllowToUpdate = ['amount', 'paymentMethod', 'paymentMethodRequirements'];
exports.updateTransaction = updateDocument(transactionModel, 'Transaction', ...fieldsThatAllowToUpdate);

// @desc    Delete transaction
// @route   DELETE /transaction/:id
// @access  Private
exports.deleteTransaction = softDeleteDocument(transactionModel, 'Transaction');
