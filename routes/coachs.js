const express = require("express")
const router = express.Router()
const { Coach, coachJoi, coachEditJoi } = require("../models/Coach")
const chekAdmin = require("../middleware/chekAdmin")
const validateBody = require("../middleware/validateBody")
const checkId = require("../middleware/chekId")
//---------------------------------------------------get coaches-------------------------------------------------------------------

router.get("/", async (req, res) => {
  const coachs = await Coach.find().populate("sport")
  res.json(coachs)
})
//--------------------------------------------------get coach
router.get("/coachs/:id", chekAdmin, checkId, async (req, res) => {
  try {
    const coachs = await Coach.findById(req.params.id).select("-__v")
    if (!coachs) return res.status(404).send("coachs not found ")
    res.json(coachs)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

///-------------------------------

//--------------------------------------------post coach--------------------------------------------------------

router.post("/", chekAdmin, validateBody(coachJoi), async (req, res) => {
  try {
    const { firstName, lastName, photo} = req.body

    const coach = new Coach({
      firstName,
      lastName,
      // classes,
      photo,
      // sport,
    })

    await coach.save()
    res.json(coach)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//-------------------------------------put coach----------------------------------------------------
router.put("/:id", chekAdmin, checkId, validateBody(coachEditJoi), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      //  classes,
      photo,
    } = req.body

    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { $set: { firstName, lastName, photo } },
      { new: true }
    )

    if (!coach) return res.status(404).send("coach not found")

    res.json(coach)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//-----------------------------------------------------------------------------------------------------

//-------------------------------------delete-------------------------------------------------
router.delete("/:id", chekAdmin, checkId, async (req, res) => {
  try {
    const coach = await Coach.findByIdAndRemove(req.params.id)

    if (!coach) return res.status(404).send("coach not found")

    res.send(coach)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

module.exports = router
