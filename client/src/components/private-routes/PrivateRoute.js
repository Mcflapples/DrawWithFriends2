//Set certain Routes to be private, meaning they can only be seen and accessed by users who have been Authenticated
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//Based on Logic from the following source: https://tylermcginnis.com/react-router-protected-routes-authentication/

const PrivateRoute = ({ component: Component, auth, ...rest}) =>(
<Route
{...rest}
render={ props => 
auth.isAuthenticated === true ? (
    <Component {...props} />
) : (
 <Redirect to="/login" />
)
}
/>
);

//Set property types for component
PrivateRoute.propTypes = {
auth: PropTypes.object.isRequired
};

//Map state of component to properties
const mapStateToProps=state=> ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);