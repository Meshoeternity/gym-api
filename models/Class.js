const mongoose = require("mongoose")
const Joi = require("joi")

const classSchema = new mongoose.Schema({
  sport: {
    type: mongoose.Types.ObjectId,
    ref: "Sport",
  },
  time: String,
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
})

const classAddJoi = Joi.object({
  time: Joi.string().min(2).max(1000).required(),
  sportId: Joi.objectid().required(),
})
const classEditJoi = Joi.object({
  time: Joi.string().min(2).max(1000),
  sportId: Joi.objectid(),
})

const Class = mongoose.model("Class", classSchema)
module.exports.Class = Class
module.exports.classAddJoi = classAddJoi
module.exports.classEditJoi = classEditJoi
