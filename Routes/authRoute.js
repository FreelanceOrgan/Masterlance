const express = require("express");
const {OAuth2Client, GoogleAuth} = require("google-auth-library");

const router = express.Router();
const {signup, increaseRegisterFriendPoints, createReferralCode, login, forgetPassword, verifyResetPasswordCode, resetPassword} = require("../Controllers/authController");
const {addClientRole} = require("../Shared/addClientRole");
const {signupValidation, loginValidation, forgetPasswordValidation, verifyResetPasswordCodeValidation, resetPasswordValidation} = require("../Middlewares/authValidation");

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


router.route("/signup/google")
    .post(async (request, response, next) => {
        response.header("Access-Control-Allow-Origin", process.env.baseURL);
        response.header("Referrer-Policy", "no-referrer-when-downgrade");
        const redirectUrl = `${process.env.baseURL}${process.env.apiVersion}/auth/google/redirect`;
        const oAuth2Client = new OAuth2Client(process.env.clientId, process.env.clientSecret, redirectUrl);
        const authorizedURL = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile',
            // prompt: "consent"
        });
        response.json({authorizedURL});
    })

router.route("/google/redirect")
    .get(async (request, response, next) => {
        const code = request.query.code;
        try {
            const redirectUrl = `${process.env.baseURL}${process.env.apiVersion}/auth/google/redirect`;
            const oAuth2Client = new OAuth2Client(process.env.clientId, process.env.clientSecret, redirectUrl);
            const res = await oAuth2Client.getToken(code);
            await oAuth2Client.setCredentials(res.tokens);
            const user = oAuth2Client.credentials;
            const theResponse = await fetch(`https://googleapis.com/oauth2/v3/userinfo`, {
                headers: { 
                    Authorization: `Bearer ${user.access_token}`
                }
            })
            const data = await theResponse.json();
            console.log(data);
        }catch(error) {
            console.log(error)
        }
    })

module.exports = router;
