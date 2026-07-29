const mongoose = require("mongoose");
 
async function connectdb() {
    try {
        await mongoose.connect(process.env.MONGODB_ATLAS_URL);
        console.log("Connected to database rankup");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectdb;