const mongo = require('../shared/mongo');
const { user_signup, user_signin, isError } = require('../shared/schema');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { reset } = require('nodemon');
dotenv.config();



const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = {

    async register(req, res) {
        try {
            const message = await isError(user_signup, req.body);
            if (message) return res.status(400).json(message);
            const user = await mongo.users.findOne({ email: req.body.email });
            if (user) return res.status(401).json({ message: "This email id is already registered" });
            req.body.resetCode = 'null';
            await mongo.users.insertOne(req.body);
            res.status(200).json({ message: "User registered successfully" });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Something went wrong" });
        }
    },
    async login(req, res) {
        try {
            const message = await isError(user_signin, req.body);
            if (message) return res.status(400).json(message);
            const user = await mongo.users.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ message: "User not found" });
            if (req.body.pass !== user.pass) return res.status(403).json({ message: "Invalid password" });
            const auth_token = jwt.sign({ _id: user._id }, process.env.KEY, {
                expiresIn: "6h",
            });
            console.log("Token for user:", auth_token);
            res.status(200).json({ message: "Success", token: auth_token });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Something went wrong" });
        }
    },
    async checkEmail(req, res) {
        try {
            const user = await mongo.users.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ message: "Email not registered" });
            let code = generateString(6);
            code = code.trim();
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'shourja.ganguly99@gmail.com',
                    pass: "uptimzyhrfaxgzkq"
                }
            });
            var mailOptions = {
                from: `shourja.ganguly99@gmail.com`,
                to: req.body.email,
                subject: 'password reset code',
                text: `Your password reset code link is /reset?email=${req.body.email}&q=${code}`,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: "Something went wrong" })
                }
            })
            await mongo.users.updateOne({ email: req.body.email }, { $set: { resetCode: code } })
            res.status(200).json({ message: `Mail has been sent successfully` })
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Something went wrong" });
        }
    },
    async verify(req, res) {
        try {
            console.log(123);
            const user = await mongo.users.findOne({ email: req.query.email });
            if (!user) return res.status(404).json({ message: "User not found" });
            if (req.query.code !== user.resetCode) return res.status(403).json({ message: "Invalid reset code" });
            res.status(200).json({ message: "Code is matched" });
        }
        catch (e) {
            res.status(500).json({ message: "Something went wrong" });
            console.log(e);
        }
    },
    async reset(req, res) {
        try {
            const user = await mongo.users.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ message: "User not found" });
            console.log("123123", req.body.code, user.resetCode)
            if (req.body.code !== user.resetCode) return res.status(403).json({ message: "Invalid reset code" });
            await mongo.users.updateOne({ email: req.body.email }, { $set: { pass: req.body.pass, resetCode: '' } });
            res.status(200).json({ message: "Password reset" });
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
}
