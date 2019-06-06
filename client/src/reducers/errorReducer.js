//functions to handle what happens when receive Error Actions from state management
import {GET_ERRORS} from "../actions/types";

//Blank initial state
const initialState ={};

export default function(state=initialState, action) {
    switch(action.type){
        case GET_ERRORS:
            return action.payload;
        default:
            return state;
    }
}