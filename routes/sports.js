const express = require("express")
const router = express.Router()
const { Sport, sportAddJoi, sportEditJoi } = require("../models/Sport")
const chekAdmin = require("../middleware/chekAdmin")
const validateBody = require("../middleware/validateBody")
const checkId = require("../middleware/chekId")
const checkToken = require("../middleware/chekToken")
const { Class, classJoi } = require("../models/Class")
const { User } = require("../models/User")
const { Coach } = require("../models/Coach")

//-----------------------------------------------------------------------------------------------------
//---------------------------------------sport-----------------------------------------------------------

router.get("/", async (req, res) => {
  const sports = await Sport.find()

    .populate("classes")
    .populate("coach")

  res.json(sports)
})
//-------------------------------------------------------------------------------------------------
router.get("/:id", checkId, async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id)

      .populate("coach") //****** */
      .populate("classes") //********** */
    if (!sport) return res.status(404).send("sport not found")

    res.json(sport)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//------------------------------------------------------------------------------------------------
router.post("/", chekAdmin, validateBody(sportAddJoi), async (req, res) => {
  try {
    const { title, poster, coach, description } = req.body

    const coachFound = await Coach.find({ _id: coach })
    if (!coachFound) return res.status(404).send("coach not found")
    console.log(coachFound)
    console.log(coach)
    const newsport = new Sport({
      title,
      poster,
      coach,
      description,
    })

    await newsport.save()
    const coachh = await Coach.findByIdAndUpdate(coachFound, { $push: { sport: newsport._id } })
    if (!coachh) return res.status(404).send("coach not foundddd")
    res.json(newsport)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//----------------------------------------- put sport---------------------------------------------------
router.put("/:id", chekAdmin, checkId, validateBody(sportEditJoi), async (req, res) => {
  try {
    const { title, poster, coach, description } = req.body

    const coachFound = await Coach.findOne({ _id: coach })
    if (!coachFound) return res.status(404).send("coach not found")

    let sport = new Sport({
      title,
      poster,
      coach,
      description,
    })

    sport = await Sport.findByIdAndUpdate(req.params.id, { $set: { title, poster, coach, description } }, { new: true })
    if (!sport) return res.status(404).send("sport not found")

    const coachh = await Coach.findByIdAndUpdate(coachFound, { $set: { sport: sport._id } }, { new: true })

    res.json(sport)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//-----------------------------------------------------------------------------------------------
router.delete("/:id", chekAdmin, checkId, async (req, res) => {
  try {
    await Class.deleteMany({ sport: req.params.id })

    const sport = await Sport.findByIdAndRemove(req.params.id)
    if (!sport) return res.status(404).send("sport not found")

    await Coach.findByIdAndUpdate(req.params.id, { $pull: { sport: req.params.id } })

    console.log(sport)

    res.send("sport is removed")
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//--------------------------------------------------------------------------------------------------------

module.exports = router
