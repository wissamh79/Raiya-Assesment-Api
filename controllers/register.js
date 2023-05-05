const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  noContentError,
} = require("../errors");

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate user input
  if (!(email && password && firstName && lastName)) {
    res.status(400).send("All input is required");
  }

  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login");
  }

  // Create user in our database
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password, // sanitize: convert email to lowercase
  });

  // Saving refreshToken with current user
  const accessToken = user.createAccessJWT();
  const refreshToken = user.createRefreshJWT();

  // return new user
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
      message: "user created  successfully",
    });
};

module.exports = register;
