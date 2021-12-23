const mongoose = require("mongoose")
const Joi = require("joi")

const sportSchema = new mongoose.Schema({
    title: String,
    poster: String,
    coach: 
    {
      type: mongoose.Types.ObjectId,
      ref: "Coach",
    },
    classes: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Class",
        },
      ],
   
})
const sportAddJoi = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    poster: Joi.string().uri().min(5).max(1000).required(),
    coach: Joi.objectid().required(),
   classes: Joi.array().items(Joi.objectid()),
  })
  const sportEditJoi = Joi.object({
    title: Joi.string().min(1).max(200),
    poster: Joi.string().uri().min(5).max(1000),
    coach: Joi.objectid(),
   classes: Joi.array().items(Joi.objectid()).min(1),
  })
  const Sport = mongoose.model("Sport", sportSchema)
module.exports.Sport = Sport
module.exports.sportAddJoi = sportAddJoi
module.exports.sportEditJoi = sportEditJoi
