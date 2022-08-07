const express = require("express");
const question = require("./questions");
const auth = require("./auth");
const user = require("./user");
const admin = require("./admin");



const router = express.Router();

router.use("/auth", auth);
router.use("/questions", question);
router.use("/users",user);
router.use("/admin",admin);



module.exports = router;