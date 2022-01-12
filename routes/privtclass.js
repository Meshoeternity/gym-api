const express = require("express")
const router = express.Router()
const validateBody = require("../middleware/validateBody")
const checkToken = require("../middleware/chekToken")
const chekAdmin = require("../middleware/chekAdmin")
const { PrivtClass, privtclassAddJoi, privtclassEditJoi } = require("../models/PrivtClass")
const { User } = require("../models/User")
const { Coach } = require("../models/Coach")
const checkAdmin = require("../middleware/chekAdmin")
const validateId = require("../middleware/validateId")

//----------------------------------get-----------------------------------------------------------
//----------------------------// available times //----------------------
router.get("/", async (req, res) => {
  const privtclass = await PrivtClass.find({ user: undefined })

  res.json(privtclass)
})

router.get("/all", async (req, res) => {
  const privtclass = await PrivtClass.find()

  res.json(privtclass)
})
//---------------------------------------add PrivtClass-----------------------------------------
router.post("/:coachId", checkAdmin, validateBody(privtclassAddJoi), async (req, res) => {
  try {
    const { time } = req.body

    const newprivtclass = new PrivtClass({
      time,
      coach: req.params.coachId,
    })
    await newprivtclass.save()

    await Coach.findByIdAndUpdate(req.params.coachId, { $push: { privtclass: newprivtclass._id } })
    // await User.findByIdAndUpdate(req.userId, { $set: {privtclass: newprivtclass._id } })

    res.json(newprivtclass)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

//----------------------------------------------------------------------------------------------

//-----------------------------------------put PrivtClass-----------------------------------------
router.put("/:id", chekAdmin, validateBody(privtclassEditJoi), async (req, res) => {
  try {
    const { time } = req.body

    const privtClass = await PrivtClass.findByIdAndUpdate(req.params.id, { $set: { time } }, { new: true })

    if (!privtClass) return res.status(404).send("privtClass not found")

    res.json(privtClass)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

////--------------------------------delete---------------------------------------

router.delete("/:id", chekAdmin, async (req, res) => {
  try {
    const privtclass = await PrivtClass.findByIdAndRemove(req.params.id)

    if (!privtclass) return res.status(404).send("PrivtClass not found")

    res.send(privtclass)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

//------------------------------------------------------------------

//--------------------------add  sub-privtclass-------   الاشتراك بكلاس خاص-----------------------------------------------
router.post("/:privtclassId/sub-privtclass", checkToken, validateId("privtclassId"), async (req, res) => {
  try {
    const privtclassFound = await PrivtClass.findByIdAndUpdate(req.params.privtclassId, { $set: { user: req.userId } })
    if (!privtclassFound) return res.status(404).send("privtclass not found")

    const user = await User.findById(req.userId)
    if (user.privtclass) return res.status(400).send("you already have privtclass")

    await User.findByIdAndUpdate(req.userId, { $set: { privtclass: req.params.privtclassId } })

    res.send("Add privtclass")
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//-----------------------------------------------------

router.delete("/:privtclassId/sub-privtclass", checkToken, async (req, res) => {
  try {
    const privtclassFound = await PrivtClass.findByIdAndRemove(req.params.classId, { $pull: { user: req.userId } })
    if (!privtclassFound) return res.status(404).send("privtclassFound not found")

    await User.findByIdAndUpdate(req.userId, { $unset: { privtclass: undefined } })

    res.send("class removed")
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

//---------------------------------------------------------------------
module.exports = router
