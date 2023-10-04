const transactionModel = require("../Models/transactionModel")
const {verifyPayPalWebhookSignature} = require("../Services/transactionService")
const APIError = require("../ErrorHandler/APIError");
const responseFormatter = require("../ResponseFormatter/responseFormatter")

exports.confirmTransaction = async (request, response, next) => {
    if(await verifyPayPalWebhookSignature(request)) {
        const transactionRequestId = +request.body.resource.purchase_units[0].reference_id
        const transaction = await transactionModel.findById(transactionRequestId);
        if(transaction) {
            if(!transaction.isConfirmed) {
                transaction.isConfirmed = true;
                await transaction.save();
                response.status(200).json(responseFormatter(true, "Your transaction request has been confirmed successfully.", [transaction]));
                return;
            }
            response.status(200).json(responseFormatter(false, "Your transaction request is already confirmed", [transaction]));
            return;
        }
    }
    throw new APIError("Your signature is not valid", 400);
};