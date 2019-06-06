//Handle all Login back-end Logic
const Validator = require("validator");
const isEmpty = require("is-empty");

//Validation function to ensure the Client is inputting valid data
module.exports = function validateLoginInput(data){
    let errors = {};
//Fields left empty are converted to empty string to make sure validator function still works
data.email = !isEmpty(data.email) ? data.email : "";
data.password = !isEmpty(data.password) ? data.password : "";

//Email validation - check if empty
if(Validator.isEmpty(data.email))
{
    errors.email = "Email is Required";
} else if (!Validator.isEmail(data.email)){
    errors.email = "Email is of Invalid Format";
}

//Password Validation - check if empty and follows special requirements (must be between 6 - 50 characters)
if(Validator.isEmpty(data.password))
{
    errors.password = "A Password is Required";
}

//IF there are no errors returned, the information is valid and can be passed into the DB
return{
    errors,
    isValid: isEmpty(errors)
};
};