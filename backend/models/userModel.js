import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  username:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    minLength: 8,
    required: true
  },
  profilePic:{
    type: String,
    default:""
  },
  followers:{
    type: [String],
    default: []
  },
  following:{
    type: [String],
    default: []
  },
  bio:{
    type: String,
    default: ""
  },
  isFrozen:{
    type: Boolean,
    default: false
  },
  role:{
    type: String,
    enum: [ "USER" , "SUBUSER" , "ADMIN" , "MANGER" ],
    default: "USER"
  }

},{
  timestamps: true,
})

const User = mongoose.model("User" , userSchema);

export default User;