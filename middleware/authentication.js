const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const auth = async (req, res, next) => {
  //check header
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
    //attach the user to the task routes
    req.user = {
      userId: payload.userId,
      email: payload.email,
      // role: payload.role,
    };
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Authentication invalid1");
  }
};
// const isAdmin = async (req, res) => {
//   const { role } = req.user;
//   if (role !== "admin") {
//     throw new Error("You are not an admin");
//   } else {
//     next();
//   }
// };
module.exports = auth;
