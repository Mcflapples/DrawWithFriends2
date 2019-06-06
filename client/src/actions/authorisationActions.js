//Using Axios, handle all Authorisation requests that are sent in HTTPRequests
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Import the current Potential States
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

//Register the User and dispatch the actions to be handled by reducers
export const registerUser = (userData, history)=> dispatch=> {
    axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login")) //re-direct to login if their registration is successful
    .catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

//Login and Get the Users Auth Token
export const loginUser = userData => dispatch => {
    axios
    .post("/api/users/login", userData)
    .then(res => {
        //Save the Auth Token to Local Storage
        //Set token within local storage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        //set token to authorisation header
        setAuthToken(token);
        //Decode token to get user data
        const decoded = jwt_decode(token);
        //after decoding - set the current User
        dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
        dispatch({
            type:GET_ERRORS,
            payload: err.response.data
        })
    );
};

//Set the current Logged in User
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

//Set User to  Loading
export const setUserLoading =() => {
    return {
        type: USER_LOADING
    };
};

//Log the user out and remove their authorisation token
export const logoutUser = () => dispatch => {
    //remove token from local storage
    localStorage.removeItem("jwtToken");
    //remove authorisation header from future HTTP Requests
    setAuthToken(false);
    //Set current user to an empty object to clear trace of past auth
    dispatch(setCurrentUser({}));
};
