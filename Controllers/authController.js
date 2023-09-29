const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIError = require("../ErrorHandler/APIError");
const responseFormatter = require("../ResponseFormatter/responseFormatter");
const userModel = require("../Models/userModel");
const {addDocument} = require("./Base/baseController");
const {sendEmail} = require("../Services/sendEmailService");

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
}

// @desc    Create referral code for each client user only will be added to Database
// @route   No
// @access  No
exports.createReferralCode = async (request, response, next) => {
    let isReferralCodeCreated = false;
    do {
        const referralCode = generateReferralCode()
        const isExist = await userModel.findOne({referralCode});
        if(!isExist) {
            request.body.referralCode = referralCode;
            isReferralCodeCreated = true;
        }
    }while(!isReferralCodeCreated);
    next();
}

// @desc    increase the points of friend when use his referral code during registration
// @route   No
// @access  No
exports.increaseRegisterFriendPoints = async (request, response, next) => {
    if(request.body.registerFriendCode) {
        const friend = await userModel.findOne({referralCode: request.body.registerFriendCode}, {points: 1});
        if(friend) {
            friend.points += 1;
            friend.save();
        }
    }
    next();
}

// @desc    Signup
// @route   POST /auth/signup
// @access  Public
exports.signup = addDocument(userModel, 'User');

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (request, response, next) => {        
    const user = await userModel.findOne({email: request.body.email}, {__v: 0, createdAt: 0, updatedAt: 0});
    if(user && await bcrypt.compare(request.body.password, user.password)) {
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
        const token = jwt.sign({id: user._id, role: user.role}, process.env.Secret_Key, {expiresIn: process.env.Expiration_Time});
        response.status(200).json(responseFormatter(true, 'Login successfully', [
            {
                user: {
                    _id: user._id,
                    name: `${user.fullName}`,
                    email: user.email,
                    role: user.role.name
                }, 
                token: token,
            }]));
        return;
    }
    next(new APIError('Your email or password may be incorrect', 403));
})

// @desc    Forget Password
// @route   POST /api/v1/auth/forgetpassword
// @access  Public
exports.forgetPassword = asyncHandler(async (request, response, next) => {
    const user = await userModel.findOne({ email: request.body.email });
    if(user) {
        try {
            const resetCode = Math.floor(100000 + Math.random() * 900000);
            const message = `
            <h3 style="color: black">Hi ${user.fullName}</h3>
            <p style="color: black">We received a request to reset your password on your Masterlance account.</p>
            <p style="color: black">This is your reset password code</p
            <strong style="font-size: 18px">${resetCode}</strong>
            <p style="color: black">Enter this code to complete the reset</p>
            <p style="color: black">Thanks for helping us keep your account secure.</p>
            <p style="color: black">Masterlance Team</p>
            `
            sendEmail({email: user.email, subject: "Reset Password Code", message: message});

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
})

// @desc    Verify Reset Password Code
// @route   POST /api/v1/auth/verifyresetpasswordcode
// @access  Public
exports.verifyResetPasswordCode = asyncHandler(async (request, response, next) => {
    const user = await userModel.findOne({email: request.body.email}, {email: 1, resetPasswordCode: 1})
    if(user) {
        if(user.resetPasswordCode && user.resetPasswordCode.code && await bcrypt.compareSync(request.body.code.toString(), user.resetPasswordCode.code)) {
            if(user.resetPasswordCode.expirationTime >= Date.now()) {
                if(user.resetPasswordCode.isVerified === false) {
                    user.resetPasswordCode.isVerified = true;
                    await user.save();
                    response.status(200).json(responseFormatter(true, 'Your code is verified'));
                    return;
                }
                throw new APIError("This code is already used before, try to ask another code", 400);
            }
            throw new APIError("This code expired, try to ask another code", 400);
        }
        throw new APIError("Invalid code, try to ask another code", 400);
    }
})

// @desc    Verify Reset Password
// @route   POST /api/v1/auth/resetpassword
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
})
