const mongoose = require("mongoose")
const Joi = require("joi")

const coachSchema = new mongoose.Schema({
  
  sportId: {
    type: mongoose.Types.ObjectId,
    ref: "Sport",
  },
  
    firstName: String,
    lastName: String,
    photo: String,
})
//اللي بنستقبله من المستخدم
const coachJoi = Joi.object({
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100),
    classes: Joi.array().items(Joi.objectid()),
    photo: Joi.string().uri().min(6).max(1000).required(),
   
  })
  const coachEditJoi = Joi.object({
    firstName: Joi.string().min(2).max(100),
    lastName: Joi.string().min(2).max(100),
    classes: Joi.array().items(Joi.objectid()),
    photo: Joi.string().uri().min(6).max(1000),
  
  })
  
const Coach = mongoose.model("Coach", coachSchema )
module.exports.Coach = Coach
module.exports.coachJoi  = coachJoi
module.exports.coachEditJoi  = coachEditJoi  
