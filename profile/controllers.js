const Profile = require("./model.js");
const User = require("../user/model.js");

//  @desc   :  Get user profile
//  @Route  :  GET /api/profile/:id
//  @access :  Public
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const userProfile = await Profile.findOne({ userId: id }).populate('userId');

        if (!userProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        return res.status(200).json({ data: userProfile });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const createProfile = async (req, res) => {
    try {
        const {
            email,
            name,
            gender,
            number,
            address,
            userId
        } = req.body;
        const photo = req.file ? req.file?.filename : null;

        // Check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create the profile
        const profile = await Profile.create({
            userId,
            name,
            gender,
            number,
            photo,
            address
        });

        // Update the user's email
        user.email = email || user.email;
        await user.save();

        return res.status(201).json({
            _id: profile._id,
            name: profile.name,
            email: user.email,
            gender: profile.gender,
            number: profile.number,
            photo: profile.photo,
            userId: profile.userId
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//  @desc   :  If USer Profile not available then create else update
//  @Route  :  PUT /api/profile
//  @access :  Public
const updateProfile = async (req, res) => {
    try {
        const {
            email,
            name,
            gender,
            number,
            address,
            userId
        } = req.body;
        const photo = req.file ? req.file?.filename : null;

        // Find the profile associated with the user
        let profile = await Profile.findOne({ userId });

        // If profile doesn't exist, return 404
        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Update the existing profile
        profile.name = name || profile.name;
        profile.gender = gender || profile.gender;
        profile.number = number || profile.number;
        profile.photo = photo || profile.photo;
        profile.address = address || profile.address;

        await profile.save();

        // Update the user's email
        const user = await User.findById(userId);
        if (user) {
            user.email = email || user.email;
            await user.save();
        }

        return res.status(200).json({
            _id: profile._id,
            name: profile.name,
            email: user ? user.email : undefined,
            gender: profile.gender,
            number: profile.number,
            photo: profile.photo,
            address: profile.address,
            userId: profile.userId
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//  @desc   :  Delete the User and Profile
//  @Route  :  DELETE /api/profile/:userId
//  @access :  Public
const deleteProfileAndUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Delete profile
        await Profile.findOneAndDelete({ userId });

        // Delete user
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


//  Exporting the routes
module.exports = {
    getUserProfile,
    updateProfile,
    deleteProfileAndUser,
    createProfile
  };