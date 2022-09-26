const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const mongo = require('./shared/mongo');
const authRoutes = require('./routes/auth.routes.js');

dotenv.config();


(async () => {
    try {
        app.listen(process.env.PORT, () => console.log('listening on port ' + process.env.PORT));
        await mongo.connect();
        app.use(cors({
            origin: "*"
        }));
        app.use(express.json());
        app.get("/", (req, res) => res.json({ message: "hi" }));
        app.use("/auth", authRoutes);
    }
    catch (e) {
        console.log(e);
    }
})();