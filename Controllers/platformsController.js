const asyncHandler= require('express-async-handler');
const {getAccessToken, getUserData} = require('../Services/OAuthService');
// const APIError = require('../ErrorHandler/APIError');
// const ResponseFormatter = require('../ResponseFormatter/responseFormatter');

exports.getUserInfoFromFreelancer = asyncHandler(async (request, response, next) => {
  const {code, redirectUrl} = request.body;
  const platformInfo = {
    client_id: process.env.Freelancer_Client_Id,
    client_secret: process.env.Freelancer_client_Secret,
    access_token: process.env.Freelancer_Access_Token, 
    redirect_uri: redirectUrl, 
    tokenURL: process.env.Freelancer_Token_Url,
  }
  const {access_token} = await getAccessToken(code, platformInfo);
  // const data = await getUserData('https://www.freelancer-sandbox.com/api/users/0.1/self', access_token);
  const data = await getUserData('https://www.freelancer-sandbox.com/api/messages/0.1/messages', access_token);
  response.status(200).json(data);
});

exports.getUserInfoFromLinkedIn = asyncHandler(async (request, response, next) => {
  const {code, redirectUrl} = request.body;
  const platformInfo = {
    client_id: process.env.Linkedin_Client_Id,
    client_secret: process.env.Linkedin_Client_Secret,
    redirect_uri: redirectUrl, 
    tokenURL: process.env.Linkedin_Token_Url,
  }
  const {access_token} = await getAccessToken(code, platformInfo);
  const data = await getUserData('https://api.linkedin.com/v1/people/~/mailbox', access_token);
  response.status(200).json(data);
});