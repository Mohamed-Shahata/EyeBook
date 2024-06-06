import User from '../models/userModel.js';
import Post from "../models/postModel.js";
import bcrypt from 'bcryptjs';
import genrateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import {v2 as cloudinary} from 'cloudinary';
import mongoose from 'mongoose';

const getUserProfile = async (req , res) => {
  //we will fetch user profile either with username or userId
  // query is either username or userId
  const { query } = req.params;
  try {
    let user;

    //query is userId
    if(mongoose.Types.ObjectId.isValid(query)){
      user = await User.findOne({_id: query}).select("-password").select("-updatedAt");
    }else{
      //query is username
      user = await User.findOne({ username: query.trim() }).select("-password").select("-updatedAt");
    }
    if(!user) return res.status(404).json({error: "User Not Found"});

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Erorr in getUserProfile: ",err.message);
  }
}

const signupUser = async (req , res) => {
  try {
    const {name , email , username , password} = req.body;
    const user = await User.findOne({$or: [{email} , {username}]});

    if(user){
      return res.status(400).json({error: "User already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password , salt);

    const newUser = new User({
      name,
      email,
      username: `@${username.trim()}`,
      password: hashPassword,
    });
    await newUser.save();

    if(newUser){
      genrateTokenAndSetCookie(newUser._id , res);
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username.trim(),
        bio: newUser.bio,
        profilePic: newUser.profilePic
      });
    }else{
      res.status(400).json({error: "Invalid user data"});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Erorr in signupUser: ",err.message);
  }
}

const loginUser = async (req , res) => {
  try {
    const {email , password} = req.body;
    const user = await User.findOne({email});
    const isPasswordCorrect = await bcrypt.compare(password , user?.password || "");

    if(!user || !isPasswordCorrect){
      return res.status(400).json({error: "Invalid email or password"});
    }

    if(user.isFrozen){
      user.isFrozen = false;
      await user.save();
    }

    genrateTokenAndSetCookie(user._id , res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic
    })
  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Erorr in loginUser: ",err.message);
  }
};

const logoutUser = (req , res) => {
  try {
    res.cookie("jwt" , "" , {maxAge:1});
    res.status(200).json({message: "logged out successfuly"})
  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Erorr in logoutUser: ",err.message);
  }
}

const followUnfollowUser = async (req , res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if(id === req.user._id.toString()){
      return res.status(400).json({error:"You cannot follow/unfollow yourself"});
    };
    if(!userToModify || !currentUser){
      return res.status(400).json({error:"User Not Found"});
    }

    const isFollowing = currentUser.following.includes(id);
    if(isFollowing){
      //UnfollowUser
      await User.findByIdAndUpdate(req.user._id , {$pull: {following: id}});
      await User.findByIdAndUpdate(id , {$pull: {followers: req.user._id}});
      res.status(200).json({message:"User unfollowed successfully"});
    }else{
      //followUser
      await User.findByIdAndUpdate(req.user._id , {$push: {following: id}});
      await User.findByIdAndUpdate(id , {$push: {followers: req.user._id}});
      res.status(200).json({message:"User followed successfully"});
    }

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Erorr in followUnfollowUser: ",err.message);
  }
}

const updateUser = async (req , res) => {
  const { name , email , username , password , bio} = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if(!user){
      return res.status(404).json({error: "User Not Found"});
    }
    if(req.params.id !== userId.toString()){
      return res.status(400).json({error: "You connot update other user's profile"});
    }

    if(password){
      const salt = await bcrypt.genSalt(10);
      const hachPassword = await bcrypt.hash(password , salt);
      user.password = hachPassword;
    }

    if(profilePic){
      if(user.profilePic){
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
      }
      const uploadeResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadeResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    if (username.trim().charAt(0) !== '@') {
      username = `@${username.trim()}` || `@${user.username.trim()}`;
    }else{
      user.username = username.trim() || user.username.trim();
    }
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    // Find all posts that this user replied and update username and userProfilePic fields
    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
    { arrayFilters: [{ "reply.userId": userId }] }
  );

    user.password = null;
    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({error: err.message});
    console.log("Erorr in updateUser: ", err);
  }
}

const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezeAccount = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		user.isFrozen = true;
		await user.save();

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};


const getAllUsers = async (req , res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
		res.status(500).json({ error: error.message });
  }
};

export { 
  signupUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  getUserProfile,
  getSuggestedUsers,
  freezeAccount,
  getAllUsers
};