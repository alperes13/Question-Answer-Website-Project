const mongoose = require("mongoose");

/* 

    There is for database connect, working with mongoose.

*/

const connectDatabase = () => {

    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDb Connection Successful");
    })
    .catch(err => {
        console.error(err);
    });
};

module.exports = connectDatabase;