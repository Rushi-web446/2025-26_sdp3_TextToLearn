const express = require("express");
const router = express.Router();
const {saveCourseForUser} = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.js");


router.post("/save/course", protect, saveCourseForUser);


module.exports = router;