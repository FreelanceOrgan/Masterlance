const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const userModel = require("../Models/userModel");
const {generateAccessToken, generateRefreshToken, decode, isTokenExpired, verifyRefreshToken} = require("../Services/JWTGenerator");
const {sendEmail} = require("../Services/sendEmailService");
const responseFormatter = require("../ResponseFormatter/responseFormatter");
const APIError = require("../ErrorHandler/APIError");

// @desc    Generate random Referral Code 
// @route   No
// @access  No
const generateReferralCode = () => {
	const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	let code = '';
	for (let i = 0; i < 4; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		code += characters[randomIndex];
	}
	return code;
};

// @desc    Check if refresh token will expired soon or not
// @route   No
// @access  No
const isRefreshTokenExpiredSoon = (refreshToken) => {
	if(!refreshToken) {
		return true
	}
	const {exp} = decode(refreshToken);
	if(exp) {
		const secondsRemaining = exp - Math.floor(Date.now() / 1000);
		const daysRemaining = Math.ceil(secondsRemaining / 86400); // 60 * 60 * 24 = 86400 sec per day
		if(daysRemaining < 3) {
			return true;
		}
	}
	return false;
}

// @desc    Create referral code for each client user only will be added to Database
// @route   No
// @access  No
exports.createReferralCode = async (request, response, next) => {
	let isReferralCodeCreated = false;
	do {
		const referralCode = generateReferralCode()
		const isExist = await userModel.findOne({"freelancer.referralCode": referralCode});
		if(!isExist) {
			request.body.referralCode = referralCode;
			isReferralCodeCreated = true;
		}
	}while(!isReferralCodeCreated);
	next();
};

// @desc    Increase the points of friend when use his referral code during registration
// @route   No
// @access  No
exports.increaseRegisterFriendPoints = async (request, response, next) => {
	if(request.body.registerFriendCode) {
		const friend = await userModel.findOne({"freelancer.referralCode": request.body.registerFriendCode}, {freelancer: 1});
		if(friend) {
			friend.freelancer.points += 1;
			friend.save();
		}
	}
	next();
};

// @desc    Signup
// @route   POST /auth/signup
// @access  Public
exports.signup = asyncHandler(async (request, response, next) => {
	const {firstName, lastName, email, password, mobilePhone, whatsAPP, timeZone, profileImage, referralCode, role} = request.body;
	const user = await userModel.create({
		firstName,
		lastName,
		email,
		password,
		mobilePhone,
		whatsAPP,
		profileImage,
		freelancer: {
			timeZone,
			referralCode
		},
		role,
		refreshToken: generateRefreshToken({firstName, lastName, email, profileImage})
	});
	response.status(201).json(responseFormatter(true, 'Signup successful', [{
		user: {
			_id: user._id,
			firstName,
			lastName,
			email,
			mobilePhone,
			whatsAPP,
			profileImage,
			freelancer: {
				timeZone,
				referralCode,
				points: user.freelancer.points
			}
		},
		token: generateAccessToken(user),
		refreshToken: user.refreshToken
	}]))
})

// @desc    Login
// @route   POST /auth/login
// @access  Public
exports.login = asyncHandler(async (request, response, next) => {        
	const user = await userModel.findOne({email: request.body.email}, {__v: 0, createdAt: 0, updatedAt: 0});
	if(user && (user.provider === request.body.provider || bcrypt.compareSync(request.body.password, user.password))) {
		if(user.deleted) {
			next(new APIError('Your account is deleted', 403));
			return;
		}
		if(user.blocked) {
			next(new APIError('Your account is blocked', 403));
			return;
		}
		if(!user.available) {
			user.available = true;
			await user.save();
		}

		if(isRefreshTokenExpiredSoon(user.refreshToken)) {
			user.refreshToken = generateRefreshToken(user);
			await user.save()
		}

		response.status(200).json(responseFormatter(true, 'Login successfully', [
			{
				user: {
					_id: user._id,
					name: `${user.firstName} ${user.lastName}`,
					email: user.email,
					profileImage: user.profileImage,
					role: user.role.name
				}, 
				token: generateAccessToken(user),
				refreshToken: user.refreshToken
		}]));
		return;
	}
	next(new APIError('Your email or password may be incorrect', 403));
});

// @desc    Forget Password
// @route   POST /auth/password/forget
// @access  Public
exports.forgetPassword = asyncHandler(async (request, response, next) => {
	const user = await userModel.findOne({ email: request.body.email });
	if(user) {
		try {
			const resetCode = Math.floor(100000 + Math.random() * 900000);
			const message = `
			<h3 style="color: black">Hi ${user.firstName} ${user.lastName}</h3>
			<p style="color: black">We received a request to reset your password on your ${process.env.App_Name} account.</p>
			<p style="color: black">This is your reset password code</p
			<strong style="font-size: 18px">${resetCode}</strong>
			<p style="color: black">Enter this code to complete the reset</p>
			<p style="color: black">Thanks for helping us keep your account secure.</p>
			<p style="color: black">${process.env.App_Name} Team</p>
			`
			await sendEmail({email: user.email, subject: "Reset Password Code", message: message});

			user.resetPasswordCode = {
				code: resetCode,
				expirationTime: Date.now() + 10 * 60 * 1000, // 10 minutes from the time of reset code generation
				isVerified: false
			}
			await user.save();

		}
		catch(error) {
			next(new APIError("The email is not send, pleas try again", 500));
			return;
		}
	}
	response.status(200).json(responseFormatter(true, 'If your email is found, you will receive a reset code to reset your password'));
});

// @desc    Verify Reset Password Code
// @route   POST /auth/password/verify
// @access  Public
exports.verifyResetPasswordCode = asyncHandler(async (request, response, next) => {
	const user = await userModel.findOne({email: request.body.email}, {email: 1, resetPasswordCode: 1})
	if(user) {
		if(user.resetPasswordCode && user.resetPasswordCode.code && bcrypt.compareSync(request.body.code.toString(), user.resetPasswordCode.code)) {
			if(user.resetPasswordCode.expirationTime >= Date.now()) {
				if(user.resetPasswordCode.isVerified === false) {
					user.resetPasswordCode.isVerified = true;
					await user.save();
					response.status(200).json(responseFormatter(true, 'Your code is verified'));
					return;
				}
			}
		}
		throw new APIError("Invalid code, try to ask another code", 400);
	}
});

// @desc    Verify Reset Password
// @route   POST /auth/password/reset
// @access  Public
exports.resetPassword = asyncHandler(async (request, response, next) => {
	const user = await userModel.findOne({email: request.body.email}, {email: 1, resetPasswordCode: 1})
	if(user) {
		if(user.resetPasswordCode.expirationTime >= Date.now()) {
			if(user.resetPasswordCode.isVerified) {
				user.password = request.body.newPassword;
				user.resetPasswordCode = {
					code: undefined,
					expirationTime: undefined,
					isVerified: undefined,
				}
				await user.save();
				response.status(200).json(responseFormatter(true, 'Your password is reset successfully'));
				return;
			}
			throw new APIError("This code is already used before, try to ask another code", 400);
		}
		throw new APIError("This code expired, try to ask another code", 400);
	}
});

// @desc    Refresh access token
// @route   POST /auth/token/refresh
// @access  Public
exports.refreshAccessToken = asyncHandler(async (request, response, next) => {
	let {accessToken, refreshToken} = request.body;
	if(isTokenExpired(accessToken)) {
		verifyRefreshToken(refreshToken);
		const accessTokenPayload = decode(accessToken);
		console.log(accessTokenPayload);
		const user = await userModel.findById(accessTokenPayload.id);

		if(!user || user.refreshToken !== refreshToken) {
			throw new APIError('Invalid tokens, try to login again', 400);
		}

		accessToken = generateAccessToken(user);

		if(isRefreshTokenExpiredSoon(refreshToken)) {
			refreshToken = generateRefreshToken(user);
			user.refreshToken = refreshToken;
			await user.save();
		};
	}
	response.status(200).json(responseFormatter(true, 'Your access token has been refreshed successfully.', [{
		accessToken,
		refreshToken
	}]));
})