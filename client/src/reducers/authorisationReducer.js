//Reducers handle how an application responds to changes made by actions in redux management
//Import the possible action types
import {
SET_CURRENT_USER,
USER_LOADING
} from "../actions/types";

//const to use to check if something has been left empty
const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

//Function to determine what is to be done for each of the imported Actions
export default function(state = initialState, action) {
    switch (action.type){
        case SET_CURRENT_USER:
            return {
              ...state,
              isAuthenticated: !isEmpty(action.payload),
              user: action.payload
    };
        case USER_LOADING:
        return {
            ...state,
            loading: true
        };
        default:
            return state;
    }
}