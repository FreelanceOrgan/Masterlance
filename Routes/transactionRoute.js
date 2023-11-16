const express = require("express");

const router = express.Router();
const {authentication, authorization, allowFreelancerRoleOnly} = require("../Services/authService");
const {addLoginUserIdToRequestBody, addLoginUserIdToRequestQuery} = require("../Shared/addToRequest");
const {idValidation} = require("../Middlewares/idValidation")
const {addTransactionValidation, updateTransactionValidation} = require("../Middlewares/transactionValidation")
const {getAllTransactions, allowIsConfirmedTransactionsOnly, getTransactionById, addTransaction, updateTransaction, deleteTransaction} = require("../Controllers/transactionController");
const {ModelNames} = require('../enums/ModelPermissions');

router.route("/")
	.all(authentication, authorization(ModelNames.Transactions))
	.get(allowIsConfirmedTransactionsOnly, addLoginUserIdToRequestQuery("user"), getAllTransactions)
	.post(allowFreelancerRoleOnly, addLoginUserIdToRequestBody('user'), addTransactionValidation, addTransaction)

router.route("/:id")
	.all(authentication, authorization(ModelNames.Transactions), idValidation)
	.get(getTransactionById)
	.patch(updateTransactionValidation, updateTransaction)
	.delete(deleteTransaction)

module.exports = router;