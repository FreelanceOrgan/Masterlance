const express = require("express");
const {signup, increaseRegisterFriendPoints, createReferralCode, login, forgetPassword, verifyResetPasswordCode, resetPassword} = require("../Controllers/authController");
const {addFreelancerRole} = require("../Shared/addFreelancerRole");
const {signupValidation, loginValidation, forgetPasswordValidation, verifyResetPasswordCodeValidation, resetPasswordValidation} = require("../Middlewares/authValidation");

const router = express.Router();

router.route("/signup")
    .post(addFreelancerRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route("/login")
    .post(loginValidation, login)

router.route("/password/forget")
    .post(forgetPasswordValidation, forgetPassword)

router.route("/password/verify")
    .post(verifyResetPasswordCodeValidation, verifyResetPasswordCode)

router.route("/password/reset")
    .post(resetPasswordValidation, resetPassword)

module.exports = router;
