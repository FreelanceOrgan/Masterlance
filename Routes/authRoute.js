const express = require("express");
const {signup, increaseRegisterFriendPoints, createReferralCode, login, forgetPassword, verifyResetPasswordCode, resetPassword} = require("../Controllers/authController");
const {addClientRole} = require("../Shared/addClientRole");
const {signupValidation, loginValidation, forgetPasswordValidation, verifyResetPasswordCodeValidation, resetPasswordValidation} = require("../Middlewares/authValidation");

const router = express.Router();

router.route("/signup")
    .post(addClientRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route("/login")
    .post(loginValidation, login)

router.route("/forgetpassword")
    .post(forgetPasswordValidation, forgetPassword)

router.route("/verifyresetpasswordcode")
    .post(verifyResetPasswordCodeValidation, verifyResetPasswordCode)

router.route("/resetpassword")
    .post(resetPasswordValidation, resetPassword)

module.exports = router;
