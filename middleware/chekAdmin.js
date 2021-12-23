const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkAdmin = async (req, res, next) => {
  //next يعني بينادي اللي بعده
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).send("token is missing")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY) //تقارن التوكن والسكريت
    const userId = decryptedToken.id

    const adminFound = await User.findById(userId)
    if (!adminFound) return res.status(404).send("user not found")

    if (adminFound.role !== "Admin") return res.status(403).send("you are not admin")
  } catch (error) {
    return res.status(500).json(error.message)
  }
  next()
}
module.exports = checkAdmin
