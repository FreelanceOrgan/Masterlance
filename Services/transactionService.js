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

const createTransactionSession = async (transactionId, totalAmount) => {
	const { PaypalBaseURL } = process.env;
	const accessToken = await generateAccessToken();
	const url = `${PaypalBaseURL}/v2/checkout/orders`;
	const payload = {
		intent: "CAPTURE",
		purchase_units: [{
			amount: {
				value: totalAmount,
				currency_code: "USD",
			},
			reference_id: transactionId,
		}],
	};
    
	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		method: "POST",
		body: JSON.stringify(payload),
	});
	return await response.json();
}

const isPayPalWebhookSignatureVerified = async (request) =>{
	const authAlgo = request.headers['paypal-auth-algo'];
	const transmissionId = request.headers['paypal-transmission-id'];
	const transmissionTime = request.headers['paypal-transmission-time'];
	const certUrl = request.headers['paypal-cert-url'];
	const transmissionSig = request.headers['paypal-transmission-sig'];
	
	const response = await fetch('https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${await generateAccessToken()}`
		},
		body: JSON.stringify({ 
			transmission_id: transmissionId, 
			transmission_time: transmissionTime, 
			cert_url: certUrl, 
			auth_algo: authAlgo, 
			transmission_sig: transmissionSig, 
			webhook_id: process.env.PaypalWebhookId, 
			webhook_event: request.body
		})
	});
	const responseJson = await response.json();
	if(responseJson.verification_status === 'SUCCESS') {
		return true;
	}
	return false;
}

const sendSessionURL = (totalAmount, response) => {
	const { PaypalClientId, PaypalSecretKey, PaypalMode } = process.env;

	paypal.configure({
		mode: PaypalMode, //sandbox or live
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
	}, 1000 * 60 * 30) // 30 minutes 
}

module.exports = {createTransactionSession, isPayPalWebhookSignatureVerified, sendSessionURL, deleteInConfirmedTransactions}