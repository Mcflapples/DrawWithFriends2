//Combine all Reducers into a single Root Reducer for State Management
import {combineReducers} from "redux";
import authorisationReducer from "./authorisationReducer";
import errorReducer from "./errorReducer";

export default combineReducers({
    auth: authorisationReducer,
    errors: errorReducer
});
