const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "Users",
        },
        name: {
            type: String,
            require: true,
        },
        photo: {
            type: String,
            default: null,
        },
        number: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model("Profiles", profileSchema);

module.exports = Profile;
