//Set and Delete the authorisation token for a user to determine whether or not a user has logged in yet.
import axios from "axios";

const setAuthToken = token => {
    if (token) {
        //Apply authorisation token to every request of a user if they have logged in
        axios.defaults.headers.common["Authorisation"]=token;
    } else {
        //Delete Authorisation for user
        delete axios.defaults.headers.common["Authorisation"];
    }
};
export default setAuthToken;