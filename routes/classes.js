const express = require("express")
const router = express.Router()
const chekAdmin = require("../middleware/chekAdmin")
const validateBody = require("../middleware/validateBody")
const checkId = require("../middleware/chekId")
const checkToken = require("../middleware/chekToken")
const { Class, classAddJoi, classEditJoi } = require("../models/Class")
const { Sport } = require("../models/Sport")
const { User } = require("../models/User")
const validateId = require("../middleware/validateId")
// //----------------------------------get-----------------------------------------------------------
//----------------------------class----------------------
router.get("/", async (req, res) => {
  const classes = await Class.find()

  res.json(classes)
})

//---------------------------------------add class-----------------------------------------
router.post("/", chekAdmin, validateBody(classAddJoi), async (req, res) => {
  try {
    const { time, sportId } = req.body

    const newclass = new Class({
      time,
      sport: sportId,
    })

    await newclass.save()

    await Sport.findByIdAndUpdate(sportId, { $push: { classes: newclass._id } })

    res.json(newclass)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//------------------------------------------------------

//-----------------------------------------put classes-----------------------------------------
router.put("/:id", chekAdmin, checkId, validateBody(classEditJoi), async (req, res) => {
  try {
    const { time,sportId } = req.body

    const classes = await Class.findByIdAndUpdate(req.params.id, { $set: { time,sportId } }, { new: true })

    if (!classes) return res.status(404).send("classes not found")

    res.json(classes)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

////--------------------------------delete---------------------------------------

router.delete("/:id", chekAdmin, checkId, async (req, res) => {
  try {
    const classes = await Class.findByIdAndRemove(req.params.id)

    if (!classes) return res.status(404).send("classes not found")

    res.send(classes)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

//------------------------------------------------------------------

//--------------------------add  sub-class-------الاشتراك بكلاس -----------------------------------------------
router.post("/:classId/sub-class", checkToken, validateId("classId"), async (req, res) => {
  try {
    const classFound = await Class.findByIdAndUpdate(req.params.classId, { $push: { members: req.userId } }) 
    if (!classFound) return res.status(404).send("class not found")

    await User.findByIdAndUpdate(req.userId, { $push: { classes:req.params.classId } })

    res.send("Addclass")
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

module.exports = router
