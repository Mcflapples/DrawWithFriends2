//this api will handle the sockets and connections on the DrawRoom components
const express = require("express");
const router = express.Router();
const http = require("http").Server(express);
const io = require("socket.io")();


//Set the EXPRESS to use the imported components for package handling
//express.use(cors());
//express.use(bodyParser.json());
//express.use(bodyParser.urlencoded({extended:false}));

//Route to create special ID for User's Session
//@route POST api/users/drawRoom
//@desc create and assign a unique sesisonKey
//@access Private facing API, only to those with access
router.post('/drawRoom', (req,res)=> {
  console.log("Post has been Made to create a sesisonKey");
    const sessionKey = generateId(24);
    sessions[sessionKey] = new Sessions(req.body.userName);
    res.json({success: true, sessionKey});
});

setInterval(() => {
    for(sessionKey in sessions) {
      const session = sessions[sessionKey];
      session.decrementTimer();
      if(session.getTimer() === 0) {
        delete sessions[sessionKey];
      }
    }
  }, 1000);
const sessions = {};

class Sessions {
    //State values of an Active Drawer
    constructor(userName){
        this._userName = userName;
        this._mouseX =0;
        this._mouseY =0;
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
    for(let i = 0; i < len; i ++) {
       result += Math.floor(Math.random() * 10);
    }
    return result;
  }


  //Start the Socket connection which will push and emit all ActiveUsers Positions to other users
  io.on("connection", socket => {
    setInterval(() => {
          console.log("A connection has been established");
         const sessionKeys = Object.keys(sessions);
         const cursorPositions = [];
         //Loop and update cursorPositions for each User
         for(let i =0, n = sessionKeys.length; i < n; i ++){
            const key = sessionKeys[i];
            const session = sessions[key];
            cursorPositions.push({
                x: session.getMouseX(),
                y: session.getMouseY(),
                userName: session.getName(),
                key: session.getName()
            });
         }
         //Emit - send the cursor positions to all other clients connected
         socket.emit("cursor", cursorPositions);
        }, Math.round(1000/30));

      socket.on("cursor", data => {
          console.log("A line is being drawn");
          const session = sessions[data.sessionKey];
          session.resetTimer();
          session.setMouseX(data.x);
          session.setMouseY(data.y);
      });

      socket.on('line', data => {
        const session = sessions[data.sessionKey];
        const lineCoordinates = data.lineCoordinates;
        io.emit('line', { 
            lineWidth: data.lineWidth,
            lineColor: data.lineColor,
            lineCoordinates
        });
      });
    });


    //The port that the sockets will continue to listen on for updates
 // http.listen(3001, () => {
   //   console.log("Listening on Port 3001");
  //});

  //Export router so API requests can be called from front-end
module.exports = router;