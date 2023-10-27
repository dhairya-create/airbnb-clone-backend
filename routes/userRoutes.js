const express = require("express");

const { registerUser,loginUser,getUserProfile,userLogout } = require("../controllers/userController");

//defining router
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile",getUserProfile)
router.post('/logout',userLogout)
module.exports = router;
