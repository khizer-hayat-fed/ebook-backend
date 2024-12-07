const User = require("./model.js");
const Shop = require("../shop/model.js")
const generateToken = require("../utils/generateToken.js");

//  @desc   :  Auth user /set token
//  @Route  :  POST /api/users/auth
//  @access :  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({message:"Email or password missing!"})
  }

  const user = await User.findOne({ email });
  const shop = await Shop.findOne({email});

  if (
    user &&
    (await user.matchPassword(password))
  ) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      email: user.email,
      type: user.type,
      shopId: shop?._id,
      name: shop?.name
    });
  } else {
    res.status(401).json({message:"Invalid email or password"})
  }
}

//  @desc   :  logout user
//  @Route  :  POST /users/logout
//  @access :  Public
const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logout Sucessfully" });
}

//  @desc   :  Register user
//  @Route  :  POST /users
//  @access :  Public
const registerUser = async (req, res) => {
  try{
    const {
      email,
      password,
      type,
      name
    } = req.body;
    const userExist = await User.findOne({ email });
    let newShop;
  
    if (userExist) {
      return res.status(400).json({message:"User already exist"});
    }
  
  
    const user = await User.create({
      email,
      password,
      type
    });

    if(type === 'manager'){
      newShop = await Shop.create({email, name});
    }
  
    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        email: user.email,
        type: user.type,
        name: newShop?.name,
        shopId: newShop?._id
      });
    } else {
      return res.status(400).json({message:"Invalid user data"})
    }
  }catch(error){
    console.log(error.message)
  }
  
}

//  @desc   :  Get user profile
//  @Route  :  GET /users/profile
//  @access :  Private
const getUserProfile = async (req, res) => {
  // req.user is coming from protect middleware
  const user = req.user;
  res.status(200).json(user);
}

//  @desc   :  Update USer Profile
//  @Route  :  PUT users/profile
//  @access :  Private
const updateUserProfile = async (req, res) => {
  try {
    // req.user is coming from the protect middleware
    const {
      email,
      firstname,
      lastname,
      password,
      city,
      type,
      gender,
      number,
      vendor,
      account,
      town
    } = req.body;
    const photo = req.files?.photo ? req.files?.photo[0]?.filename : null;
    const experience = req.files?.experience ? req.files?.experience[0]?.filename : null;
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstname = firstname || user.firstname;
      user.email = email || user.email;
      user.lastname = lastname || user.lastname;
      user.city = city || user.city;
      user.type = type || user.type;
      user.gender = gender || user.gender;
      user.number = number || user.number;
      user.vendor = vendor || user.vendor;
      user.experience = experience || user.experience;
      user.photo = photo || user.photo;
      user.account = account || user.account;
      user.experience = experience || user.experience;
      user.town = town || user.town;

      if (password) {
        user.password = password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        email: updatedUser.email,
        lastname: updatedUser.lastname,
        city: updatedUser.city,
        type: updatedUser.type,
        gender: updatedUser.gender,
        number: updatedUser.number,
        vendor: updatedUser.vendor,
        photo: updatedUser.photo,
        account: updatedUser.account,
        experience: updatedUser.experience,
        town: updatedUser.town,
      });
    } else {
      res.status(404).json({message:"User Not Found"})
    }
  } catch (error) {
    console.log(error.message)
  }

}

const forgetPassword = async (req, res) => {
  const email = req.params.email;

  const isValidUser = await User.findOne({ email });

  if (!isValidUser) {
    res.status(404).json({message:'User not found!'})
  }

//   await sendForgetPasswordMail({
//     sendTo: email,
//     context: {
//       inviteLink: `http://localhost:3000/setpassword/${isValidUser._id}`,
//     },
//   });

  res.status(200).json("Email has been send.");
}

//  Exporting the routes
module.exports = {
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  registerUser,
  forgetPassword,
};
