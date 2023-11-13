const mongoose = require("mongoose");
const AutoIncrement = require('../Config/autoIncrementInitialization');

const transactionSchema = mongoose.Schema(
	{
		_id: {
			type: mongoose.SchemaTypes.Number
		},
		user: {
			type: Number,
			required: [true, 'Any transaction must belong to a user'],
			ref: 'users'
		},
		amount: {
			type: Number,
			required: [true, 'Any transaction must have an amount'],
		},
		paymentMethod: {
			type: String,
			required: [true, 'Any transaction must have a payment method'],
			enum: ['vodafoneCash', 'bankAccountNumber']
		},
		paymentMethodRequirements: {
			type: String,
			required: [true, 'Any transaction must have a payment method requirements'],
		},
		isConfirmed: {
			type: Boolean,
			default: false
		},
		isTransferred: {
			type: Boolean,
			default: false
		},
		available: {
			type: Boolean,
			default: true
		},
		deleted: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true,
	}
)

transactionSchema.plugin(AutoIncrement.plugin, {model: 'transactions', startAt: 1});

transactionSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'user',
		select: 'fullName email mobilePhone whatsAPP'
	})
	next();
})

const transactionModel = mongoose.model("transactions", transactionSchema);

module.exports = transactionModel;