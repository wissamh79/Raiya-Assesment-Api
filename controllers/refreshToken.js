const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { forbiddenError, UnauthenticatedError } = require("../errors");

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new UnauthenticatedError("No Cookies provided ");
  }
  const refreshToken = cookies.jwt;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  console.log(user);
  if (!user) {
    throw new forbiddenError("Forbidden");
  }
  try {
    jwt.verify(refreshToken, process.env.Refresh_JWT_SECRET);
    //attach the user to the task routes

    const accessToken = user.createAccessJWT();
    res
      .status(StatusCodes.OK)
      .json({ accessToken: accessToken, verified: user.verified });
  } catch (error) {
    throw new forbiddenError("Forbidden");
  }
};
module.exports = refreshToken;
