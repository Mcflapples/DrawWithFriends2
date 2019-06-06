//Handles connecting and maintaining the server connection
const app = require("express")();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors');
const users = require("./routes/api/users");
const drawing = require("./routes/api/drawing");
const port = process.env.PORT || 8080; // Defaults port
const http = require("http").Server(app); // Creates a HTTP instance to proxy HTTP requests
const io = require("socket.io")(http); // Uses the http proxy to handle websocket requests


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({ //Body Parser middleware - tell the app what parsing to use
        extended: false
    })
);

//Setup the DB to use the Mongo URI Found in Keys to connect
const dataBase = require("./config/keys").mongoURI;

//Connect to the Database using Mongoose
mongoose
    .connect(
        dataBase,
        { useNewUrlParser: true }
    )
    //Log if the connection is successful - Log the error if unsuccessful
    .then(() => console.log("Successfully connected to the Mongo DB"))
    .catch(err => console.log(err));

//Middleware for passport and passport configuration
app.use(passport.initialize());
require("./config/passport")(passport);

//Routes currently in Use
app.use("/api/users", users);

//Route to create special ID for User's Session
//@route POST api/users/drawRoom
//@desc create and assign a unique sesisonKey
//@access Private facing API, only to those with access
app.post('/api/drawing/drawRoom', (req, res) => {
    console.log("Post has been Made to create a sesisonKey");
    const sessionKey = generateId(24);
    sessions[sessionKey] = new Sessions(req.body.userName);
    res.json({ success: true, sessionKey });
});

setInterval(() => {
    for (sessionKey in sessions) {
        const session = sessions[sessionKey];
        session.decrementTimer();
        if (session.getTimer() === 0) {
            delete sessions[sessionKey];
        }
    }
}, 1000);

const sessions = {};

class Sessions {
    //State values of an Active Drawer
    constructor(userName) {
        this._userName = userName;
        this._mouseX = 0;
        this._mouseY = 0;
        this._timer = 10;
    }
    //Get functions for Users values
    getName() {
        return this.userName;
    }
    getMouseX() {
        return this._mouseX;
    }
    getMouseY() {
        return this._mouseY;
    }
    setMouseX(x) {
        this._mouseX = x;
    }
    setMouseY(y) {
        this._mouseY = y;
    }
    resetTimer() {
        this._timer = 10;
    }
    decrementTimer() {
        this._timer -= 1;
    }
    getTimer() {
        return this._timer;
    }
};

function generateId(len) {
    let result = "";
    for (let i = 0; i < len; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

// Socket IO stuff is now down here because you need to use the same HTTP proxy instance
const board = {};

//Start the Socket connection which will push and emit all ActiveUsers Positions to other users
io.on("connection", socket => {


    socket.on("cursor", data => {
        console.log(data)
    });

    socket.on('line', data => {
        console.log(data)
        io.emit('line', {
            lineWidth: data.lineWidth,
            lineColor: data.lineColor,
            lineCoordinates: data.lineCoordinates,
            id: data.id
        });
    });
});


//Listen on the port selected, log if server listen is successful
http.listen(port, () => console.log(`Server Up and Running on Port ${port} !`));