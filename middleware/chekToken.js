const jwt = require("jsonwebtoken")
const { User } = require("../models/User")

const checkToken = async (req, res, next) => {           //next يعني بينادي اللي بعده
  try {
    const token = req.header("Authorization")
    if (!token) return res.status(401).json("token is missing")

    const decryptedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)    //تقارن التوكن والسكريت
    const userId = decryptedToken.id

    const user = await User.findById(userId)
    if (!user) return res.status(404).json("user not found")
    req.userId = userId
  } catch (error) {
    return res.status(500).json(error.message)
  }
  next()
}
module.exports = checkToken
