const User = require("../models/User");

const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  noContentError,
} = require("../errors");

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    throw new noContentError("No Cookies provided ");
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",

      maxAge: 24 * 60 * 60 * 1000,
    });
    throw new noContentError("	No Content ");
  }

  await user.updateOne({ refreshToken: " " });

  res.status(StatusCodes.NO_CONTENT).cookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
};
module.exports = logout;
