//the Landing component of the site, e.g the site that is first hit when a user hits the site
import React, {Component} from "react";
import {Link} from "react-router-dom";

class Landing extends Component {
    //Draw the component using HTML and CSS from materialize
    render(){
        return(
            <div style={{height:"75vh"}} className="contaigner vertAlign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <h4>
                            <b>Draw With Friends was created by Jake Gilbert</b>
                        </h4>
                        <p className="flow-text grey-text text-darken-1">
                            Login to the System and then preceed to Draw in Real-time with other Users!
                        </p>
                        <br />
                        <div className="col s6">
                            <Link
                            to="/register"
                            style={{
                                width: "150px",
                                borderRadius: "3px",
                                letterSpacing: "2px"
                            }}
                            className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                                Register Here!
                            </Link>
                        </div>
                        <div className="col s6">
                            <Link
                            to="/login"
                            style={{
                                width:"150px",
                                borderRadius:"3px",
                                letterSpacing:"2px"
                            }}
                            className="btn btn-large btn-flat waves-effect white black-text">
                                Log in Here!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Landing;