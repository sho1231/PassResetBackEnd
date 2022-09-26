const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();



const mongo = {
    db: null,
    users: null,
    ObjectId,
    async connect() {
        try {
            const client = new MongoClient(process.env.MONGO_URL);
            await client.connect();
            this.db = client.db("forgotpassword");
            this.users = await this.db.collection("users");
            console.log("Mongo connection established successfully");
        }
        catch (e) {
            console.log("error in connection of mongo db", e);
        }
    }
}

module.exports = mongo;