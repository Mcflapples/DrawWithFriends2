//Registration component for our app
import React, {Component} from "react";
import { Link, withRouter } from "react-router-dom";
//Include components for Redux state management
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authorisationActions";
import classnames from "classnames";

class Register extends Component {
    //Set the default values for all States
    constructor() {
        super();
        this.state = {
            userName: "",
            email:"",
            password:"",
            confPassword:"",
            errors:{}
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
        if (nextProps.errors){
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
    //Create a new User in the DB with the information from the State of the form
        const newUser = {
            userName: this.state.userName,
            email: this.state.email,
            password: this.state.password,
            confPassword: this.state.confPassword
        };
        //Log the User information for Data Logging
        this.props.registerUser(newUser, this.props.history);
    console.log(newUser);
    };

    //Draw the Registration form
    render() {
        const {errors} = this.state;
        return(
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2">
                        <Link to="/" className="btn-flat waves-effect">
                            <i className="material-icons left">keyboard_backspace</i>
                            Back to Home
                        </Link>
                        <div className="col s12" style={{paddingLeft:"12px"}}>
                            <h4>
                                <b>Register Below</b>
                            </h4>
                            <p className="grey-text text-darken-1">
                                Already Registered? <Link to="/login">Log in</Link>
                            </p>
                        </div>
                       
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                               
                                <input
                                onChange={this.onChange}
                                value={this.state.userName}
                                id="userName"
                                type="text"
                                className={classnames("",{
                                    invalid: errors.userName
                                })}
                                />
                                <label htmlFor="userName">UserName</label>
                                <span className="red-text">{errors.userName}</span>
                            </div>
                            <div className="input-field col s12">
                               
                                <input
                                onChange={this.onChange}
                                value={this.state.email}
                                id="email"
                                type="email"
                                className={classnames("",{
                                    invalid: errors.email
                                })}
                                />
                                <label htmlFor="email">Email</label>
                                <span className="red-text">{errors.email}</span>
                            </div>
                            <div className="input-field col s12">
                               
                                <input
                                onChange={this.onChange}
                                value={this.state.password}
                                id="password"
                                type="password"
                                className={classnames("",{
                                    invalid: errors.password
                                })}
                                />
                                <label htmlFor="password">Password</label>
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="input-field col s12">
                               
                                <input
                                onChange={this.onChange}
                                value={this.state.confPassword}
                                id="confPassword"
                                type="password"
                                className={classnames("",{
                                    invalid: errors.confPassword
                                })}
                                />
                                <label htmlFor="confPassword">Confirm Password</label>
                                <span className="red-text">{errors.confPassword}</span>
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
                                    Sign Up!
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}


//Map the state properties Authorisation and errors to be called within Register
const mapStateToProps=state=>
({
auth: state.auth,
errors: state.errors
});
//Use prop-types package to help define types outside of a constructor
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

//Connect our Registration to Redux store of component states
export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));