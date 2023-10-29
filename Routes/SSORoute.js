const express = require("express");
const {getUserInfoFromGoogle, getUserInfoFromFacebook, getUserInfoFromLinkedIn} = require("../Services/SSOService");
const {signup, increaseRegisterFriendPoints, createReferralCode, login} = require("../Controllers/authController");
const {addClientRole} = require("../Shared/addClientRole");
const {signupValidation, loginValidation} = require("../Middlewares/authValidation");
const {SSOValidation} = require("../Middlewares/SSOValidation");

const router = express.Router();

router.route("/google/signup")
  .post(SSOValidation, getUserInfoFromGoogle, addClientRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route('/google/login')
  .post(SSOValidation, getUserInfoFromGoogle, loginValidation, login)

router.route("/facebook/signup")
  .post(SSOValidation, getUserInfoFromFacebook, addClientRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route('/facebook/login')
  .post(SSOValidation, getUserInfoFromFacebook, loginValidation, login)

router.route("/linkedin/signup")
  .post(SSOValidation, getUserInfoFromLinkedIn, addClientRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route('/linkedin/login')
  .post(SSOValidation, getUserInfoFromLinkedIn, loginValidation, login)

module.exports = router;
