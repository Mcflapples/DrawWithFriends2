//Endpoints for all API's relating to user Login and Registration
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load in the User validation Functions
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load in the User Model
const User = require("../../models/User");

//Route to user Registration
//@route POST api/users/register
//@desc Register the User into the DB
//@access Public facing API
router.post("/register", (req,res) => {
//Do form validation logic from validation on post requests body
const {errors,isValid} = validateRegisterInput(req.body);
//check validation is successful or pass errors
if (!isValid) {
    return res.status(400).json(errors);
}
//Check that the Email used is not already in use by another account - search DB for email
User.findOne({email: req.body.email}).then(user =>{
    if(user){
        return res.status(400).json({email : "Email is already linked to an account"});
    } else {
        const newUser = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        });

        //Note: Bad practice but required for Assignment, keep a Log of password before and after encruption
        //Hash and Encrypt password before it is stored into the database
        bcrypt.genSalt(10,(err,salt) => {
            bcrypt.hash(newUser.password, salt, (err,hash) => {
                console.log(newUser.password);
                if (err) throw err;
                newUser.password = hash;
                //After hashing, save contents to DB
                newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
                console.log(newUser.password);
                console.log("User has been entered into the DB");
            });
            
        });
        
    }
});
});

//Route to User Login
//@route POST api/users/login
//@desc Login User if already exists in DB and return their Web Token
//@access Public
router.post("/login", (req, res) =>{
    //Validate that login information is Valid using validation logic
    const {errors,isValid} = validateLoginInput(req.body);

    //Check the validation is successful - else return errors
    if(!isValid){
        return res.status(400).json(errors);
    }

    //Get the users Email and password input
    const email = req.body.email;
    const password = req.body.password;

    //Find if the User already exists in the DB
    User.findOne({ email }).then(user => {
        //determine Email is in use, else return an error
        if(!user){
            return res.status(404).json({emailnotfound: "Email not found"});
        }

        //Check the passwords match - use bcrypt for password encryption to make sure unencrypted password is not stored locally
        bcrypt.compare(password, user.password).then(isMatch =>{
            if(isMatch){
                //Passwords matched, Username matched, User's web token can be validated
                //Create json Web token for user
                const payload = {
                    id: user.id,
                    userName: user.userName
                };

                //Authenticate and sign the token for use
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    { // Set when expires (in seconds)
                        expiresIn: 10000
                    },
                    (err, token)=>{
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        });
                    }
                )
            } else {
                //If Password Match returns incorrect
                return res
                .status(400)
                .json({passwordincorrect: "Wrong Password"});
            }
        });
    });
});
//Export router so API requests can be called from front-end
module.exports = router;