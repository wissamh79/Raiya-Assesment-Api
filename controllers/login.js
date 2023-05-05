const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  noContentError,
} = require("../errors");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("All fields are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  // Saving refreshToken with current user
  const accessToken = user.createAccessJWT();
  const refreshToken = user.createRefreshJWT();

  await user.updateOne({
    refreshToken: refreshToken,
  });
  // Creates Secure Cookie with refresh token
  // Send access token to user

  res
    .status(StatusCodes.OK)
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",

      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      accessToken,
      message: "logged in successfully",
    });
};

module.exports = login;
