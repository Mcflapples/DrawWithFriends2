//Handles connecting and maintaining the server connection
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const drawing = require("./routes/api/drawing");

//Initialise the application 
const application = express();


//Body Parser middleware - tell the application what parsing to use
application.use(
    bodyParser.urlencoded({
        extended: false
    })
);
application.use(bodyParser.json());

//Setup the DB to use the Mongo URI Found in Keys to connect
const dataBase = require("./config/keys").mongoURI;
console.log(dataBase);

//Connect to the Database using Mongoose
mongoose
.connect(
    dataBase,
    {useNewUrlParser: true}
)
//Log if the connection is successful - Log the error if unsuccessful
.then(()=>console.log("Successfully connected to the Mongo DB"))
.catch(err=>console.log(err));

//Middleware for passport and passport configuration
application.use(passport.initialize());
require("./config/passport")(passport);

//Routes currently in Use
application.use("/api/users", users);
//application.use("/api/drawing", drawing);

//Port for server to run on, using 8080, PORT is an Environment variable
const port = process.env.PORT || 80;

//Listen on the port selected, log if server listen is successful
application.listen(port, ()=> console.log(`Server Up and Running on Port ${port} !`));