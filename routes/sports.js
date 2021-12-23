const express = require("express")
const router = express.Router()
const { Sport, sportAddJoi, sportEditJoi} = require("../models/Sport")
const chekAdmin = require("../middleware/chekAdmin")
const validateBody = require("../middleware/validateBody")
const checkId = require("../middleware/chekId")
const validateId = require("../middleware/validateId")
const checkToken = require("../middleware/chekToken")
const { Class ,classJoi} = require("../models/Class")
const { User } = require("../models/User")
const { Coach } = require("../models/Coach")
const checkAdmin = require("../middleware/chekAdmin")
const chekId = require("../middleware/chekId")

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
   
      .populate("coach")//****** */
      .populate("classes")//********** */
      if (!sport) return res.status(404).send("sport not found")
  
      res.json(sport)
    } catch (error) {
      return res.status(500).send(error.message)
    }
  })
  //------------------------------------------------------------------------------------------------
  router.post("/", chekAdmin, validateBody(sportAddJoi), async (req, res) => {
    try {
      const { title, poster, coach, classes } = req.body


      const classesSet = new Set(classes)
      if (classesSet.size < classes.length) return res.status(400).send("there is duplicated")
      const classesFound = await Class.find({ _id: { $in: classes }}) //inتبحث في مصفوفه
      if (classesFound.length < classes.length) return res.status(404).send("some of the classes is not found ")
  
      const coachFound = await Coach.findOne({ _id: coach })
      if (!coachFound) return res.status(404).send("coach not found")
  
      const sport = new Sport({
        title,
        poster,
        coach,
        classes,
      })
     
      await sport.save()
      res.json(sport)
    } catch (error) {
      return res.status(500).send(error.message)
    }
  })
  //----------------------------------------- put sport---------------------------------------------------
  router.put("/:id", chekAdmin, checkId, validateBody(sportEditJoi), async (req, res) => {
    try {
        const { title, poster, coach, classes } = req.body


        const classesSet = new Set(classes)
        if (classesSet.size < classes.length) return res.status(400).send("there is duplicated")
        const classesFound = await Class.find({ _id: { $in: classes }}) //inتبحث في مصفوفه
        if (classesFound.length < classes.length) return res.status(404).send("some of the classes is not found ")
    
        const coachFound = await Coach.findOne({ _id: coach })
        if (!coachFound) return res.status(404).send("coach not found")
    
        let sport = new Sport({
          title,
          poster,
          coach,
          classes,
        })
   
    sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { $set: { title, poster,coach, classes } },
      { new: true }
    )
    if (!sport) return res.status(404).send("sport not found")
    res.json(sport)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})
//-----------------------------------------------------------------------------------------------
router.delete("/:id", chekAdmin, checkId, async (req, res) => {
    try {
      await Class.deleteMany({ classId: req.params.id })
  
      const sport = await Sport.findByIdAndRemove(req.params.id)
      if (!sport) return res.status(404).send("sport not found")
      res.send("sport is removed")
    } catch (error) {
      res.status(500).send(error.message)
    }
  })
  //--------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------



  module.exports = router