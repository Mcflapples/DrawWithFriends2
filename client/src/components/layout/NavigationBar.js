//Navigational Bar Component which allows us to link and navigate between Pages
import React, {Component} from "react";
import {Link} from "react-router-dom";

//
class NavigationBar extends Component {
    //Render draws the component to screen
    render(){
return(
    //Html components for Component
<div className="navigationbar-fixed">
    <nav className="z-depth-0">
        <div className="nav-wrapper-white">
            <Link to="/"
            style={{
                fontFamily:"monospace"
            }}
            className="col s5 brand-logo center black-text"
            >
                <i className="material-icons">code</i>
                DRAW-WITH-FRIENDS
            </Link>
        </div>
    </nav>
</div>
    );
  }
}
export default NavigationBar;