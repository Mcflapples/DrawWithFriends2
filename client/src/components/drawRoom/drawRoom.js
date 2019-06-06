//The Drawing Room which is the main component of the game, can only be seen by an authenticated user
import React, { Component } from "react";
import { ChromePicker } from "react-color";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {logoutUser } from "../../actions/authorisationActions";
import Tool from "../../utils/Tool";
import { userInfo } from "os";

//The serverAddress of the App
const serverAddress="http://localhost:3000";


//Setup the DrawRoom components to handle realtime drawing
class DrawRoom extends Component {
  constructor(props){
    super(props);
    this.display = React.createRef();
    this.socket = null;
    this.state = {
      brushColour: {r: 0, g: 0, b: 0, a: 255},
      brushSize: 3,
      toolId: 'pen',
      isPenDown: false,
      mouseX: 0,
      mouseY: 0,
      prevX: 0,
      prevY: 0,
      cursors: [],
      userName: '',
      loaded: false
    }
  }
  componentDidMount(){
    this.socket = io(serverAddress);
    this.socket.on("line", data =>{
      if(this.state.loaded){
        //Get the disaplay values from the Tool
        const [x1,y1,x2,y2] = data.lineCoordinates;
        const displayCtx = this.display.current.getContext("2d");
        displayCtx.lineWidth = data.lineWidth;
        displayCtx.strokestyle = `rgba(${data.lineColor.r},${data.lineColor.g},${data.lineColor.b},${data.lineColor.a})`;
        displayCtx.beginPath();
        displayCtx.moveTo(x1,y1);
        displayCtx.lineTo(x2,y2);
        displayCtx.stroke();
      }
    });
    //Start the Socket
    this.socket.on("cursor", data =>{
      if(this.state.loaded){
        this.setState({cursors: data});
      }
    });
  setInterval(() => {
    if(this.state.loaded){
      //The Properties of the user that is logged in
const { user } = this.props.auth;
      this.socket.emit("cursor", {
        userName: this.state.userName,
        x: this.state.mouseX,
        y: this.state.mouseY,
        sessionKey: user.userName
      });
    }
  },8080);
  setInterval(() => {
  }, Math.round(1000/60));
  }
    handleJoin(e){
      fetch(serverAddress, {
        body: JSON.stringify({
          userName: userInfo.userName
        }),
        method: 'post',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
    }
    //Use of the Tool component
    handleToolClick(toolId){
      this.setState({toolId});
    }
    //Use of changing color with the tool
    handleColorChange(color) {
      this.setState({brushColour: color.rgb});
    }
    //Handle of Moving the Mouse location
    handleDisplayMouseMove(e){
      this.setState({
        mouseX: e.clientX,
        mouseY: e.clientY
      });
      //Check if the User is currently using pen or eraser and clicked down
      if(this.state.isPenDown){
        //The Properties of the user that is logged in
        const { user } = this.props.auth;
        this.display.current.getContext("2d").lineCap = 'round';
        const {top, left} = this.display.current.getBoundingClientRect();
        switch(this.state.toolId){
          case 'pen':
            this.socket.emit('line' , {
              lineWidth: this.state.brushSize,
              lineColor: this.state.brushColour,
              lineCoordinates: [this.state.prevX - left, this.state.prevY - top, this.state.mouseX - left, this.state.mouseY - top],
              sessionKey: user.userName
            });
            break;
            case 'rubber':
                this.socket.emit('line' , {
                  lineWidth: this.state.brushSize,
                  lineColor: {r: 255, g: 255, b: 255, a: this.state.brushColor.a},
                  lineCoordinates: [this.state.prevX, this.state.prevY, this.state.mouseX, this.state.mouseY],
                  sessionKey: user.userName
                });
                break;
            default:
              break;
        }
      }
      this.setState({
        userName: this.props.auth.userName,
        prevX: this.state.mouseX,
        prevY: this.state.mouseY
      });
      if(!this.state.isPenDown){
        this.setState({
          prevX: e.clientX,
          prevY: e.clientY
        });
      }
//Emit cursor positions
      this.socket.emit('cursor', {
        x: this.state.mouseX,
        y: this.state.mouseY,
        sessionKey: this.props.auth
      });
    }

    //Check if mouse is clicked down
    handleDisplayMouseDown(e){
      this.setState({isPenDown: true});
    }
    //Check is mouse is not clicked down
    handleDisplayMouseUp(e){
      this.setState({isPenDown: false});
    }
    //Check if the brush has been resized
    handleBrushResize(e){
      this.setState({brushSize: e.target.value})
    }

    onLogoutClick=e=>{
        e.preventDefault();
        this.props.logoutUser();
    };
    render()
    {
      const { user } = this.props.auth;
        //Create a Canvas to Draw On, the Tools for Drawing and the Logout Button
        return (
          <div>
             <div style={{ height: "30vh" }} className="container valign-wrapper">
 <div className="row">
   <div className="col s12 center-align">
     <h4>
       <b>Had Enough?,</b> {user.userName.split(" ")[0]}
       </h4>
       <button
       style={{
         width: "150px",
         borderRadius: "3px",
         letterSpacing: "1.5px",
         marginTop: "1rem"
       }}
       onClick={this.onLogoutClick}
       className="btn btn-large waves-effect waves-light hoverable blue accent-3"
     >
       Logout Here
     </button>
     </div>
 </div>
</div>
          <canvas className="display" width="1000" height="850" ref={this.display} onMouseMove={this.handleDisplayMouseMove.bind(this)} onMouseDown={this.handleDisplayMouseDown.bind(this)} onMouseUp={this.handleDisplayMouseUp.bind(this)}></canvas>
          <div className="toolbox">
              <ChromePicker color={this.state.brushColor} onChangeComplete={this.handleColorChange.bind(this)}></ChromePicker>
              <Tool name="Eraser" currentTool={this.state.toolId} toolId="eraser" onSelect={this.handleToolClick.bind(this)}/>
              <Tool name="Pen" currentTool={this.state.toolId} toolId="pen" onSelect={this.handleToolClick.bind(this)}/>
              <code className="brush-size-label">Size ({String(this.state.brushSize)})</code> <input onChange={this.handleBrushResize.bind(this)} value={this.state.brushSize} type="range" min="1" max="50"/>
              <span className="brush-size-indicator" style={{width: this.state.brushSize + 'px', height: this.state.brushSize + 'px', background: this.state.brushColor}}></span>
          </div>
          {
            this.state.cursors.map(cursor => (
              <div key={cursor.sessionKey} className="cursor" style={{left: (cursor.x+8) + 'px', top: (cursor.y+8) + 'px'}}>
                <div style={{borderRadius: '75px', position: 'relative', background: 'silver', width: '2px', height: '2px'}}></div> {cursor.sessionKey}
              </div>
            ))
          }
         </div>
 
        );
    }
}

//Assign the properties of the user in this component
DrawRoom.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

//Assign state to properties for auth
const mapStateToProps=state=>({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(DrawRoom);