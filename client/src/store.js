//Create the store which will hold the state tree for the app, so that the states can be accessed across multiple components
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
//import the reducers 
import rootReducer from "./reducers";

//default value for states
const initialState={};

//use thunk as the middleware
const middleware = [thunk];
//create the data store
const store = createStore(
rootReducer,
initialState,
compose(
    applyMiddleware(...middleware),
    (window.__REDUX_DEVTOOLS_EXTENSION__&&
    window.__REDUX_DEVTOOLS_EXTENSION__()) ||
    compose
    )
);

export default store;