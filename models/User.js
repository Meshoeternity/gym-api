const mongoose = require("mongoose")
const Joi = require("joi")

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  emailVerified: {
    type: Boolean,
    default:false,
      },
  password: String,
  avatar: String,
  sport: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Sport",
    },
],
 

  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User",
  },
  privtclass:{
    type: mongoose.Types.ObjectId,
    ref: "PrivtClass",
  }
})
const signupJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
  avatar: Joi.string().uri().max(1000).required(),
})
const loginJoi = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
})
const profileJoi = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  password: Joi.string().min(6).max(100),
  avatar: Joi.string().uri().max(1000),
})
const User = mongoose.model("User", userSchema)

module.exports.User = User
module.exports.signupJoi = signupJoi
module.exports.loginJoi = loginJoi
module.exports.profileJoi = profileJoi
