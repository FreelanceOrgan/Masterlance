const express = require("express");

const router = express.Router();
const {signup, login, forgetPassword, verifyResetPasswordCode, resetPassword} = require("../Controllers/authController");
const {addClientRole} = require("../Shared/addClientRole");
const {signupValidation, loginValidation, forgetPasswordValidation, verifyResetPasswordCodeValidation, resetPasswordValidation} = require("../Middlewares/authValidation");

router.route("/signup")
    .post(addClientRole, signupValidation, signup)

router.route("/login")
    .post(loginValidation, login)

router.route("/forgetpassword")
    .post(forgetPasswordValidation, forgetPassword)

router.route("/verifyresetpasswordcode")
    .post(verifyResetPasswordCodeValidation, verifyResetPasswordCode)

router.route("/resetpassword")
    .post(resetPasswordValidation, resetPassword)


module.exports = router;
