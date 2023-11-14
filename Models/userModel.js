const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(+process.env.salt_round);
const AutoIncrement = require('../Config/autoIncrementInitialization');

const resetPasswordCode = mongoose.Schema(
	{
		code: {
			type: String
		},
		expirationTime: {
			type: Date
		},
		isVerified: {
			type: Boolean,
			default: false
		}
	}, 
	{_id: false}
);

const freelancerSchema = mongoose.Schema(
  {
    timeZone: {
      type: String,
			required: [true, 'Timezone is required']
    },
    referralCode: {
      type: String,
      maxlength: 4,
    },
    points: {
      type: Number,
      default: 0
    },
    nationalIdImage: {
      type: String,
    },
    selfieWithNationalIdImage: {
      type: String,
    },
    isUserVerified: {
      type: Boolean,
      default: false
    },
  },
	{
		_id: false
	}
)

const userSchema = mongoose.Schema(
	{
		_id: {
			type: mongoose.SchemaTypes.Number
		},
		firstName: {
			type: String,
			trim: true,
			required: [true, 'Firstname is required'],
			minlength: [3, 'Too short Firstname, must be 3 characters at least'],
			maxlength: [32, 'Too long Firstname, must be 32 characters at most'],
		},
		lastName: {
			type: String,
			trim: true,
			required: [true, 'Lastname is required'],
			minlength: [3, 'Too short Lastname, must be 3 characters at least'],
			maxlength: [32, 'Too long Lastname, must be 32 characters at most'],
		},
		email: {
			type: String,
			trim: true,
			required: [true, 'Email is required'],            
			match: [/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Invalid email"],
			lowercase: true,
			unique: [true, 'This email address is already used']
		},
		password: {
			type: String,
			trim: true,
			required: [true, 'Password is required'],            
		},
		mobilePhone: {
			type: String,
			trim: true,
			required: [true, 'Mobile phone is required'],
			unique: [true, 'This mobile phone number already exists']
		},
		whatsAPP: {
			type: String,
			trim: true,
			required: [true, 'WhatsApp number is required'],
			unique: [true, 'This whatsApp number already exists']
		},
		profileImage: {
			type: String,
		},
		provider: {
			type: String,
		},
		refreshToken: {
			type: String,
		},
		role: {
			type: Number,
			ref: 'roles',
			required: [true, 'Any user must have a role']
		},
		freelancer: {
			type: freelancerSchema
		},
		resetPasswordCode: {
			type: resetPasswordCode
		},
		passwordUpdatedTime: {
			type: Date
		},
		available: {
			type: Boolean,
			default: true
		},
		blocked:{
			type: Boolean,
			default: false
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

userSchema.plugin(AutoIncrement.plugin, {model: 'users', startAt: 1});

userSchema.pre('save', async function(next) {
	if(this.password) {
		this.password = bcrypt.hashSync(this.password, salt);
	}
	if(this.resetPasswordCode && this.resetPasswordCode.code && +this.resetPasswordCode.code) {
		this.resetPasswordCode.code = bcrypt.hashSync(this.resetPasswordCode.code.toString(), salt);
	}
	next();
});

userSchema.pre(/^find/, function (next) {
	this.populate(
		{
			path: 'role',
			select: 'name allowedModels -_id'
		},
	)
	next();
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;