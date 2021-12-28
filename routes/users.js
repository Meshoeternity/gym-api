const express = require("express")
const router = express.Router()
const { User, signupJoi, loginJoi, profileJoi } = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const checkToken = require("../middleware/chekToken")
const checkAdmin = require("../middleware/chekAdmin")
const checkId = require("../middleware/chekId")
const validateBody = require("../middleware/validateBody")

//----------------------------------------------------------------------------------------------
router.post("/signup", validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already reqistered")

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
      emailVerified: false,
      role: "User",
    })

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: "mashaelalomari99@gmail.com", // generated ethereal user
    //     pass: "Mashael99", // generated ethereal password
    //   },
    // })
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })

    // await transporter.sendMail({
    //   from: '"testt" <mashaelalomari99@gmail.com>', // sender address
    //   to: email, // list of receivers
    //   subject: "Email verification", // Subject line

    //   html: `Hello,plase click on this link to verify your email.
    //     <a href="http://localhost:3001/email_verified/${token}">Verify email</a>`,
    // })

    await user.save()
    delete user._doc.password
    // res.json("user created , plase check your email for verification link")
    res.json("sign succes")//اذا ضبط الفرونت اند احذف هذا الريس جيسون وابقي اللي فوق 
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//-------------------------------------------------------------------------------
// router.get("/Verify_email/:token", async (req, res) => {
//   try {
//     const decryptedToken = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY)
//     const userId = decryptedToken.id
//     const user = await User.findByIdAndUpdate(userId, { $set: { emailVerified: true } })
//     if (!user) return res.status(404).send("user not found")
//     res.send("user verified")
//   } catch (error) {
//     res.status(500).send(error.message)
//   }
// })
//--------------------------------------------login-----------------------------------------------------
router.post("/login", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).send("user not registered")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    // if (!user.emailVerified) return res.status(403).send("user not verified, please check your email")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" }) //مفتاح توكن ومدة الباسورد
    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//------------------------------------------login Admin--------------------------------------------------
router.post("/login/admin", validateBody(loginJoi), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(404).send("user not registered")

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).send("password incorrect")

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" })
    res.json(token)
  } catch (error) {
    res.status(500).send(error.message)
  }
})
//--------------------------------------------get users في الداش بورد
router.get("/users", checkAdmin, async (req, res) => {
  const user = await User.find().select("-__v -password")
  res.json(user)
})
//------------------------------------حذف يوزر--------------------
router.delete("/users/:id", checkAdmin, checkId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-__v -password")
    if (!user) return res.status(404).send("user not found")

    if (user.role === "Admin") return res.status(403).send("unauthorized action")
    await User.findByIdAndRemove(req.params.id)
  
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
//----------------------------------------------profile------------------------------------------------------------------
router.get("/profile", checkToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password")
    .populate({
      path:"classes",
      select:"-members",
      populate:"sport"
    })
    
    if (!user) return res.status(404).send("user not found")
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})
//-----------------------------------------put profile----------------------------------------------------------
router.put("/profile", checkToken, validateBody(profileJoi), async (req, res) => {
  const { firstName, lastName, password, avatar,sportId } = req.body//سبورت اي دي او الكلاس 

  let hash
  if (password) {
    const salt = await bcrypt.genSalt(10)
    hash = await bcrypt.hash(password, salt)
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { firstName, lastName, password: hash, avatar,sportId} },
    { new: true }
  ).select("-__v -password")
  res.json(user)
})
//-----------------post /sign up admin------------  تسجيل دخول للادمن وبعدها يضيف 
router.post("/add-admin", checkAdmin, validateBody(signupJoi), async (req, res) => {
  try {
    const { firstName, lastName, email, password, avatar } = req.body

    const userFound = await User.findOne({ email })
    if (userFound) return res.status(400).send("user already registered")

    const salt = await bcrypt.genSalt(10) //لتشفير الباسورد خلطة ملح يعني
    const hash = await bcrypt.hash(password, salt)

    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      avatar,
      role: "Admin",
    })
    await user.save()
    delete user._doc.password
    res.json(user)
  } catch (error) {
    res.status(500).json(error.message)
  }
})

module.exports = router
