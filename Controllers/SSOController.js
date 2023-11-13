const crypto = require('crypto');
const asyncHandler = require("express-async-handler");
const {getAccessToken, getUserData} = require('../Services/OAuthService');

exports.getUserInfoFromGoogle = asyncHandler(async (request, response, next) => {
  const {code, redirectUrl, mobilePhone, whatsAPP, timeZone} = request.body;
  const platformInfo = {
    client_id: process.env.Google_Client_Id,
    client_secret: process.env.Google_Client_Secret, 
    redirect_uri: redirectUrl, 
    tokenURL: process.env.Google_Token_URL,
  }
  const {access_token, refresh_token} = await getAccessToken(code, platformInfo);
  const data = await getUserData('https://www.googleapis.com/oauth2/v1/userinfo', access_token);
  request.body = {
    fullName: data.name,
    email: data.email,
    mobilePhone,
    whatsAPP,
    timeZone,
    profileImage: data.picture,
    provider: 'Google',
    refreshToken: refresh_token,
    password: `M${crypto.randomUUID()}*`
  };
  next();
});

exports.getUserInfoFromFacebook = asyncHandler(async (request, response, next) => {
  const {code, redirectUrl, mobilePhone, whatsAPP, timeZone} = request.body;
  const platformInfo = {
    client_id: process.env.Facebook_Client_Id,
    client_secret: process.env.Facebook_Client_Secret, 
    redirect_uri: redirectUrl, 
    tokenURL: process.env.Facebook_Token_Url,
  }
  const {access_token, refresh_token} = await getAccessToken(code, platformInfo);
  const data = await getUserData('https://graph.facebook.com/v18.0/me', access_token);
  console.log(data);
  request.body = {
    fullName: data.name,
    email: data.email,
    mobilePhone,
    whatsAPP,
    timeZone,
    profileImage: data.picture,
    provider: 'Facebook',
    refreshToken: refresh_token,
    password: `M${crypto.randomUUID()}*`
  };
  // next();
});

exports.getUserInfoFromLinkedIn = asyncHandler(async (request, response, next) => {
  const {code, redirectUrl, mobilePhone, whatsAPP, timeZone} = request.body;
  const platformInfo = {
    client_id: process.env.Linkedin_Client_Id,
    client_secret: process.env.Linkedin_Client_Secret, 
    redirect_uri: redirectUrl, 
    tokenURL: process.env.Linkedin_Token_Url,
  }
  const {access_token, refresh_token} = await getAccessToken(code, platformInfo);
  // const data = await getUserData('https://api.linkedin.com/v2/userinfo', access_token);
  const data = await getUserData('https://api.linkedin.com/v1/people/~/mailbox?folder=inbox&message-type=message-connections', access_token);
  console.log(data);
  request.body = {
    fullName: data.name,
    email: data.email,
    mobilePhone,
    whatsAPP,
    timeZone,
    profileImage: data.picture,
    provider: 'LinkedIn',
    refreshToken: refresh_token,
    password: `M${crypto.randomUUID()}*`
  };
  // next();
});