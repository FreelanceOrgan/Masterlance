const crypto = require('crypto');
const asyncHandler = require("express-async-handler");
const APIError = require("../ErrorHandler/APIError");

const getAccessToken = async (code, platformInfo) => {
  try {
    const {client_id, client_secret, redirect_uri, tokenURL} = platformInfo;
    const params = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    });
  
    const response = await fetch(tokenURL, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: params,
    });
    
    return await response.json();
  }catch(error) {
    throw APIError(error.message, error.status);
  }
}

const getUserData = async (scopeURL, access_token) => {
  try {
    const res = await fetch(scopeURL, {
    method: 'GET',  
    headers: { 
        Authorization: `Bearer ${access_token}`
      }
    })
    return await res.json();
  }catch(error) {
    throw new APIError(error.message, 400);
  }
}

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
  const data = await getUserData('https://graph.facebook.com/v14.0/me?fields:id,name,picture,email', access_token);
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
  console.log(data);
  // next();
});

exports.getUserInfoFromLinkedIn = asyncHandler(async (request, response, next) => {
  const {code, redirectUrl, mobilePhone, whatsAPP, timeZone} = request.body;
  // console.log(code);
  const platformInfo = {
    client_id: process.env.Linkedin_Client_Id,
    client_secret: process.env.Linkedin_Client_Secret, 
    redirect_uri: redirectUrl, 
    tokenURL: process.env.Linkedin_Token_Url,
  }
  const {access_token, refresh_token} = await getAccessToken(code, platformInfo);
  const data = await getUserData('https://api.linkedin.com/v2/userinfo', access_token);
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
  next();
});