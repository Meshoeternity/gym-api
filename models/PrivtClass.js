const mongoose = require("mongoose")
const Joi = require("joi")

const privtclassSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Types.ObjectId,
    ref: "Coach",
  },
  time: String,
  
 user: 
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

 
})

const privtclassAddJoi = Joi.object({
  time: Joi.string().min(2).max(1000).required(),
  coachId: Joi.objectid(),
})
const privtclassEditJoi = Joi.object({
  time: Joi.string().min(2).max(1000),
  coachId: Joi.objectid(),
})

const PrivtClass = mongoose.model("PrivtClass",privtclassSchema)
module.exports.PrivtClass = PrivtClass
module.exports.privtclassAddJoi = privtclassAddJoi
module.exports.privtclassEditJoi = privtclassEditJoi
