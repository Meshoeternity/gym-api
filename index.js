const express = require("express")
const cors = require("cors")
const Joi = require("joi")
const JoiObjectId = require("joi-objectid")
Joi.objectid = JoiObjectId(Joi)
const mongoose = require("mongoose")
const users = require("./routes/users")
const sports = require("./routes/sports")
// const privtclass = require("./routes/privtclass")
const coachs = require("./routes/coachs")
const classes = require("./routes/classes")


require("dotenv").config()

mongoose
  .connect(`mongodb://localhost:27017/GymDB`)
  .then(() => {
    console.log(" Connected to MongoDB")
  })
  .catch(error => {
    console.log("Error connecting to MongoDB", error)
  })
const app = express()

app.use(express.json())
app.use(cors())
app.use("/api/auth", users)
app.use("/api/sports",sports)
app.use("/api/coachs",coachs)
app.use("/api/classes",classes)
// app.use("/api/privtclass",privtclass)

const port = 5000
app.listen(port, () => {
  console.log("server is listening on port :" + port)
})
