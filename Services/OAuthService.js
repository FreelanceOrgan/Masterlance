const APIError = require("../ErrorHandler/APIError");

exports.getAccessToken = async (code, platformInfo) => {
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
  if(response.status !== 200) {
    throw new APIError(response.statusText, response.status);
  }
  return await response.json();
};

exports.getUserData = async (scopeURL, access_token) => {
  const response = await fetch(scopeURL, {
    method: 'GET',  
    headers: { 
      Authorization: `Bearer ${access_token}`,
      // 'freelancer-oauth-v1': `${access_token}`,
    }
  });
  if(response.status !== 200) {
    throw new APIError(response.statusText, response.status);
  }
  return await response.json();
};