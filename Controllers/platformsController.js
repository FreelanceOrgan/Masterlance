const asyncHandler= require('express-async-handler');
const APIError = require('../ErrorHandler/APIError');
const ResponseFormatter = require('../ResponseFormatter/responseFormatter');

const getAccessToken = async (code, redirect_URL) => {
  try {
    const {Linkedin_Client_Id, Linkedin_Client_Secret} = process.env;
  
    const params = new URLSearchParams({
      client_id: Linkedin_Client_Id,
      client_secret: Linkedin_Client_Secret,
      code,
      redirect_uri: redirect_URL,
      grant_type: 'authorization_code',
    });
  
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      body: params,
    });
  
    return await response.json();
  }catch(error) {
    throw APIError(error.message, error.status);
  }
}

const getLinkedinProfileInfo = async (access_token) => {
  try {
    // const res = await fetch('https:/api.linkedin.com/v2/userinfo', {
    const res = await fetch('https://api.linkedin.com/v2/me/notifications', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return await res.json();
  }catch(error) {
    throw APIError(error.message)
  }
}

exports.getLinkedinInfo = asyncHandler(async (request, response, next) => {
  const {code, redirect_Url} = request.body;
  const {access_token} = await getAccessToken(code, redirect_Url);
  const linkedinProfile = await getLinkedinProfileInfo(access_token);
  if(linkedinProfile.message) {
    throw new APIError(linkedinProfile.message, linkedinProfile.status)
  }
  response.status(200).json(ResponseFormatter(true, 'The user info has been retrieved successfully', [linkedinProfile]));
})