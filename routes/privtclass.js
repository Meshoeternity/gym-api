


const express = require("express")
const router = express.Router()
const validateBody = require("../middleware/validateBody")
const checkToken = require("../middleware/chekToken")
const { PrivtClass, privtclassAddJoi} = require("../models/PrivtClass")
const { User } = require("../models/User")
const { Coach } = require("../models/Coach")






//---------------------------------------add PrivtClass-----------------------------------------
router.post("/:coachId", checkToken, validateBody(privtclassAddJoi), async (req, res) => {
    try {
      const { time } = req.body
      
      const newprivtclass = new PrivtClass({
          time,
          coach:req.params.coachId,
        })
        await newprivtclass.save()
      
  
  
      await Coach.findByIdAndUpdate(req.params.coachId, { $push: { privtclass: newprivtclass._id }, $pull: {availableTimes: time} })
      // await User.findByIdAndUpdate(req.userId, { $set: {privtclass: newprivtclass._id } })
  
      res.json(newprivtclass)
    } catch (error) {
      return res.status(500).send(error.message)
    }
  })

  //----------------------------------------------------------------------------------------------
  module.exports = router