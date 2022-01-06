const mongoose = require("mongoose")
const Joi = require("joi")

const coachSchema = new mongoose.Schema({
  sport: [{
    type: mongoose.Types.ObjectId,
    ref: "Sport",
  }],
  availableTimes: [String],
  firstName: String,
  lastName: String,
  photo: String,

  privtclass: [
    {
      type: mongoose.Types.ObjectId,
      ref: "PrivtClass",
    },
  ],
})
//
const coachJoi = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100),
  classes: Joi.array().items(Joi.objectid()),
  photo: Joi.string().uri().min(6).max(1000).required(),
  // sport: Joi.objectid(),
})
const coachEditJoi = Joi.object({
  firstName: Joi.string().min(2).max(100),
  lastName: Joi.string().min(2).max(100),
  classes: Joi.array().items(Joi.objectid()),
  photo: Joi.string().uri().min(6).max(1000),
  // sport: Joi.objectid(),
})

const Coach = mongoose.model("Coach", coachSchema)
module.exports.Coach = Coach
module.exports.coachJoi = coachJoi
module.exports.coachEditJoi = coachEditJoi
