//Json and Passport Web Authentication Token creation to keep track of user sessions and allow users to not have to login every time.
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const keys = require("../config/keys");

//Get options from required sources. 
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

//Create the passport as a module which can be called within API's
module.exports = passport => {
    passport.use(
        new JwtStrategy(options, (jwt_payload,done)=>{
            //each user has unique ID, check the DB to see if ID is currently in use in another session
            User.findById(jwt_payload.id)
            .then(user => {
                //if currently in another session
                if (user) {
                    return done(null,user);
                }
                return done(null,false);
            })
            .catch(err => console.log(err));
        })
    );
};