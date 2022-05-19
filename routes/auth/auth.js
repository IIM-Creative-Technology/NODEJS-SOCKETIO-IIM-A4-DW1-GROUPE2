const router = require("express").Router()
const User = require("../../model/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(401).send({
            message: "bad authentication",
            response: false
        })
        const userExist = await User.findOne({ username })
        if (userExist) return res.status(401).send({
            message: "user already exist",
            response: false
        })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({
            username,
            password: hashedPassword,
        })
        await user.save()
        const token = jwt.sign({ user }, process.env.JWT_SECRET)

        return res.send({
            message: 'user has been created',
            response: token
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(401).send({
        message: "bad authentication",
        response: false
    })

    try {
        const user = await User.findOne({ username })
        if (!user) return res.status(401).send({
            message: "Invalid email or password",
            response: false
        })

        const validPass = await bcrypt.compare(password, user.password)
        if (!validPass) return res.status(401).send({
            message: "password is incorrect",
            response: false
        })

        const token = jwt.sign({ user }, process.env.JWT_SECRET)
        return res.send({
            message: 'OK',
            response: {
                token,
                user,
            }
        })
    } catch (error) {
        res.status(400).send(error)
    }


})

module.exports = router