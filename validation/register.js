//Handle all Registration back-end Logic
const Validator = require("validator");
const isEmpty = require("is-empty");

//Validation function to ensure the Client is inputting valid data
module.exports = function validateRegisterInput(data){
    let errors = {};
//Fields left empty are converted to empty string to make sure validator function still works
data.userName = !isEmpty(data.userName) ? data.userName : "";
data.email = !isEmpty(data.email) ? data.email : "";
//two passwords as there is password confirmation
data.password = !isEmpty(data.userName) ? data.password : "";
data.confPassword = !isEmpty(data.userName) ? data.confPassword : "";

//Username validation - check if empty
if(Validator.isEmpty(data.userName))
{
    errors.userName = "Username is Required";
}

//Email Validation - check if empty and follows correct email syntax
if(Validator.isEmpty(data.email))
{
    errors.email = "Email is required";
} else if(!Validator.isEmail(data.email))
{
    errors.email = "Email is invalid format"
}

//Password Validation - check if empty and follows special requirements (must be between 6 - 50 characters)
if(Validator.isEmpty(data.password))
{
    errors.password = "A Password is Required";
}

if(Validator.isEmpty(data.confPassword))
{
    errors.confPassword = "Confirmation Password is Required";
}

if(!Validator.isLength(data.password, {min: 6, max: 50}))
{
    errors.password = "Password must be at least 6 characters and at most 50";
}
//Check that the two passwords are equal
if(!Validator.equals(data.password, data.confPassword))
{
    errors.password = "Password and Confirmation Password must match"
}

//IF there are no errors returned, the information is valid and can be passed into the DB
return{
    errors,
    isValid: isEmpty(errors)
};
};