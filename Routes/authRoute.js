const express = require("express");
const {signup, login, refreshAccessToken, forgetPassword, verifyResetPasswordCode, resetPassword} = require("../Controllers/authController");
const {addFreelancerRole} = require("../Shared/addFreelancerRole");
const {signupValidation, loginValidation, refreshAccessTokenValidation, forgetPasswordValidation, verifyResetPasswordCodeValidation, resetPasswordValidation} = require("../Middlewares/authValidation");

const router = express.Router();

router.route("/signup")
	.post(addFreelancerRole, signupValidation, signup)

router.route("/login")
	.post(loginValidation, login)

router.route("/token/refresh")
	.post(refreshAccessTokenValidation, refreshAccessToken)

router.route("/password/forget")
	.post(forgetPasswordValidation, forgetPassword)

router.route("/password/verify")
	.post(verifyResetPasswordCodeValidation, verifyResetPasswordCode)

router.route("/password/reset")
	.post(resetPasswordValidation, resetPassword)

module.exports = router;
