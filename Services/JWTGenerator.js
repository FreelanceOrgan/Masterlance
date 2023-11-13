const JWT = require("jsonwebtoken");

const accessTokenSecretKey = process.env.JWT_Access_Token_Secret_Key || '';
const refreshTokenSecretKey = process.env.JWT_Refresh_Token_Secret_Key || '';

exports.generateAccessToken = (user) => {
  const {_id, firstName, lastName, email, profileImage, role} = user;
  return JWT.sign({id: _id, firstName, lastName, email, profileImage, role}, accessTokenSecretKey, {expiresIn: "3d"});
};

exports.generateRefreshToken = (user) => {
  const {firstName, lastName, email, profileImage, role} = user;
  return JWT.sign({firstName, lastName, email, profileImage, role}, refreshTokenSecretKey, {expiresIn: "30d"});
};

exports.decode = (token) => {
  return JWT.decode(token);
};

exports.verifyAccessToken = (token) => {
  return JWT.verify(token, accessTokenSecretKey);
};

exports.verifyRefreshToken = (token) => {
  return JWT.verify(token, refreshTokenSecretKey);
};

exports.isTokenExpired = (token) => {
  const {exp} = this.decode(token);
  if(exp) {
    if(exp < Math.floor(Date.now() / 1000)) {
      return true;
    }
  }
  return false;
};