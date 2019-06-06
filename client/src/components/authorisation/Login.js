//Login component for our app
import React, {Component} from "react";
import { Link } from "react-router-dom";
//Import components for Redux State management
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authorisationActions";
import classnames from "classnames";


class Login extends Component {
    //Set the default values for all States
    constructor() {
        super();
        this.state = {
            email:"",
            password:"",
            errors: {}
        };
    }
    //Check is user is already logged in, redirect to Draw room
componentDidMount() {
    //if logged in and try to redirect back to this page, redirect them back
    if (this.props.auth.isAuthenticated) {
        this.props.history.push("/drawRoom");
    }
}
//Make component  receive any errors from props
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/drawRoom"); //API to push user to when they login
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }
    //Whenever Any state's change
    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
    };
    //When the information is the form is submit
    onSubmit=e=> {
        e.preventDefault();
    //Store the Data of the Current User for Login
        const userData = {
            email: this.state.email,
            password: this.state.password,
        };
        //Log the User information for Data Logging
        this.props.loginUser(userData);
    console.log(userData);
    };

    //Draw the Registration form
    render() {
        const {errors} = this.state;

        return(
            <div className="container">
                <div style={{marginTop:"4rem"}} className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i>Back to Home!
                        </Link>
                        <div className="col s12" style={{paddingLeft:"12px"}}>
                            <h4>
                                <b>Login Below</b>
                            </h4>
                            <p className="grey-text text-darken-1">
                                Don't Have an Account? <Link to="/register">Register Here</Link>
                            </p>
                        </div>
                       
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                
                                <input
                                onChange={this.onChange}
                                value={this.state.email}
                                id="email"
                                type="email"
                                className={classnames("",{
                                    invalid: errors.email || errors.emailnotfound
                                })}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="red-text">
                                    {errors.email}
                                    {errors.emailnotfound}
                                </span>
                            </div>
                            <div className="input-field col s12">
                                
                                <input
                                onChange={this.onChange}
                                value={this.state.password}
                                id="password"
                                type="password"
                                className={classnames("",{
                                    invalid: errors.password || errors.passwordincorrect
                                })}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </span>
                            </div>
                            <div className="col s12" style={{paddingLeft:"12px"}}>

                                <button
                                style={{
                                    width:"150px",
                                    borderRadius:"3px",
                                    letterSpacing:"2px",
                                    marginTop:"1rem"
                                }}
                                type="submit"
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3">
                                    Login!
                                </button>
                            </div>
                        </form>
                    </div>
                    </div>
                </div>      
        );
    }
}

//Set the Prop types of the User in Login
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

//Map the current state values to properties
const mapStateToProps =state=>({
auth: state.auth,
errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);