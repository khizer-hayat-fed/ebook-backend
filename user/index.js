const express = require("express");
const router = express.Router();
const controller = require("./controllers.js")

// Importing our controllers
const { 
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    registerUser,
    forgetPassword
} = controller;

// making the routes
router.post("/logout", logoutUser);
router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/:email", forgetPassword)
router.route("/profile").get(getUserProfile).put(updateUserProfile)

module.exports = router;