const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

exports.userRegister = async (req, res) => {
    console.log("Inside Register function");
    const { username, email, password } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email }, process.env.jwtKey)
            console.log(token)
            res.status(402).json("User already exist...")
        }
        else {
            const newUser = new User({ username, email, password })
            await newUser.save()
            res.status(200).json({ message: "Register Success", newUser })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}
exports.userLogin = async (req, res) => {
    console.log("Inside login function");
    const { email, password } = req.body

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                //token generation
                const token = jwt.sign({ userMail: existingUser.email }, process.env.jwtKey)
                console.log(token)
                res.status(200).json({ message: "Login Success", existingUser, token })
            }
            else {
                res.status(401).json("password Missmatch!")
            }
        }
        else {
            res.status(401).json("User not found!")
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}
exports.googleLogin = async (req, res) => {
    const { username, email, password, profile } = req.body
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ userMail: existingUser.email }, process.env.jwtKey)
            console.log(token)
            res.status(200).json({ message: "Login Success", existingUser, token })
        }
        else {
            const newUser = new User({ username, email, password, profile })
            await newUser.save()
            const token = jwt.sign({ userMail: existingUser.email }, process.env.jwtKey)
            console.log(token)
            res.status(200).json({ message: "Login Success", existingUser, token })
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
}