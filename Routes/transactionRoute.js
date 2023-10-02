const express = require("express");

const router = express.Router();
const {authentication, authorization, allowClientRoleOnly} = require("../Services/authService");
const {addLoginUserIdToRequestBody} = require("../Shared/addToRequest");
const {idValidation} = require("../Middlewares/idValidation")
const {addTransactionValidation, updateTransactionValidation} = require("../Middlewares/transactionValidation")
const {getAllTransactions, getTransactionById, addTransaction, updateTransaction, deleteTransaction} = require("../Controllers/transactionController");

router.route("/")
    .all(authentication, authorization("transactions"))
    .get(getAllTransactions)
    .post(allowClientRoleOnly, addLoginUserIdToRequestBody, addTransactionValidation, addTransaction)

router.route("/:id")
    .all(authentication, authorization("transactions"), idValidation)
    .get(getTransactionById)
    .patch(updateTransactionValidation, updateTransaction)
    .delete(deleteTransaction)

module.exports = router;