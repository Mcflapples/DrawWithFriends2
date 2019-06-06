//User Schema which will handle all information about a user to send to the DB
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create the User Schema
const UserSchema = new Schema({
    //Username / Display name to present to all other players
    userName: {
        type: String,
        required: true
    },
    //Email to be kept internally within the DB - help to track usernames to owners
    email: {
        type: String,
        required: true
    },
    //Password for account, will be encrypted before placed into DB
    password: {
        type: String,
        required: true
    },
    //Date of Sign Up
    date: {
        type: Date,
        default: Date.now()
    }
    //Add any future aspects to store of the User such as High Score
});
module.exports = User = mongoose.model("Users", UserSchema);