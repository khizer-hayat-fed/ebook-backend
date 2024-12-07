const express = require("express");
const router = express.Router();
const {upload} = require("../middleware/multerMiddlewares")
const controller = require("./controllers.js")

// Importing our controllers
const { 
    getUserProfile,
    updateProfile,
    deleteProfileAndUser,
    createProfile
} = controller;

// making the routes
router.get('/:id', getUserProfile)
router.post('/', upload.single("photo"), createProfile)
router.put('/', upload.single("photo"), updateProfile)
router.delete('/:userId', deleteProfileAndUser)

module.exports = router;