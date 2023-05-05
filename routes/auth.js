const express = require("express");
const router = express.Router();
const register = require("../controllers/register");
const login = require("../controllers/login");
const logout = require("../controllers/logout");
const refreshToken = require("../controllers/refreshToken");
router.post("/register", register);
router.post("/login", login);

router.get("/logout", logout);
router.get("/refresh", refreshToken);

module.exports = router;
