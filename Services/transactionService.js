const paypal = require('paypal-rest-sdk');
const transactionModel = require("../Models/transactionModel")
const responseFormatter = require('../ResponseFormatter/responseFormatter');

const generateAccessToken = async () => {
    const { PaypalClientId, PaypalSecretKey, PaypalBaseURL } = process.env;
    try {
        if (!PaypalClientId || !PaypalSecretKey) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(`${PaypalClientId}:${PaypalSecretKey}`).toString("base64");
        const res = await fetch(`${PaypalBaseURL}/v1/oauth2/token`, {
            method: "POST",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = await res.json();
        return data.access_token;
    }catch (error) {
        throw Error(error.message);
    }
};

const createTransactionSession = async (totalAmount) => {
    const { PaypalBaseURL } = process.env;
    const accessToken = await generateAccessToken();
    const url = `${PaypalBaseURL}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    value: totalAmount,
                    currency_code: "USD",
                },
            },
        ],
    };
    
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
            // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
            // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
            // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
        method: "POST",
        body: JSON.stringify(payload),
    });
    return await response.json();
}

const sendSessionURL = (totalAmount, response) => {
    const { PaypalClientId, PaypalSecretKey } = process.env;

    paypal.configure({
        mode: 'sandbox', //sandbox or live
        client_id: PaypalClientId,
        client_secret: PaypalSecretKey
    });

    const paymentData = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: `${process.env.baseURL}${process.env.apiVersion}/users`,
            cancel_url: `${process.env.baseURL}${process.env.apiVersion}/transactions/cancel`,
        },
        transactions: [
            {
                amount: {
                    total: totalAmount,
                    currency: 'USD',
                },
                description: 'This is a transaction request',
            },
        ]
    };
    
    paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
            console.error(error);
            response.sendStatus(500);
        }
        else {
            response.json(responseFormatter(true, "The payment session is created successfully", [{paymentSessionId: payment.id, paymentSessionLink: payment.links[1].href}]))
        }
    });
}

const deleteInConfirmedTransactions = (transactionId) => {
    setTimeout(async () => {
        const transaction = await transactionModel.findById(transactionId);
        if(!transaction.isConfirmed) {
            await transactionModel.findOneAndDelete({_id: transactionId});
        }
    }, 1000 * 60 * 10) // 10 minutes 
}

module.exports = {createTransactionSession, sendSessionURL, deleteInConfirmedTransactions}