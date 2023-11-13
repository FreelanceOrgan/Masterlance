const express = require("express");
const {getUserInfoFromGoogle, getUserInfoFromFacebook, getUserInfoFromLinkedIn} = require("../Controllers/SSOController");
const {signup, increaseRegisterFriendPoints, createReferralCode, login} = require("../Controllers/authController");
const {addFreelancerRole} = require("../Shared/addFreelancerRole");
const {signupValidation, loginValidation} = require("../Middlewares/authValidation");
const {SSOValidation} = require("../Middlewares/SSOValidation");

const router = express.Router();

router.route("/google/signup")
  .post(SSOValidation, getUserInfoFromGoogle, addFreelancerRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route('/google/login')
  .post(SSOValidation, getUserInfoFromGoogle, loginValidation, login)

router.route("/facebook/signup")
  .post(SSOValidation, getUserInfoFromFacebook, addFreelancerRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route('/facebook/login')
  .post(SSOValidation, getUserInfoFromFacebook, loginValidation, login)

router.route("/linkedin/signup")
  .post(SSOValidation, getUserInfoFromLinkedIn, addFreelancerRole, signupValidation, increaseRegisterFriendPoints, createReferralCode, signup)

router.route('/linkedin/login')
  .post(SSOValidation, getUserInfoFromLinkedIn, loginValidation, login)

module.exports = router;
