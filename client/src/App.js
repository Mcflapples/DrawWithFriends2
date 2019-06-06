import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Auth components
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authorisationActions";

import './App.css';
//Use Redux to handle state management across multiple components
import {Provider} from "react-redux";
import store from "./store";
//Import all Components
import NavigationBar from "./components/layout/NavigationBar";
import Landing from "./components/layout/Landing";
//authorisation components
import Register from "./components/authorisation/Register";
import Login from "./components/authorisation/Login";
//Import private route and Draw Room component
import PrivateRoute from "./components/private-routes/PrivateRoute";
import DrawRoom from "./components/drawRoom/drawRoom";

//Check to see if a token is already connected to a user to keep them logged in
if (localStorage.jwtToken) {
 //Set the authorisation token header of the user
 const token = localStorage.jwtToken;
 setAuthToken(token);
 //Decode the toke to get the Users Info
 const decodedToken = jwt_decode(token);
 store.dispatch(setCurrentUser(decodedToken));

 //Check to see if a token exists but has expired due to inactivity
 const currentTime = Date.now() / 1000; //Milliseconds
 if (decodedToken.exp < currentTime) {
   //Logout the user due to inactivity
   store.dispatch(logoutUser());

   //Redirect them back to login page
   window.location.href = "./login";
 }
}

class App extends Component {
 render() {
   return (
     //Recognise the Paths to each Component
     <Provider store={store}>
     <Router>
     <div className="Draw-With-Friends">
       <NavigationBar />
       <Route exact path="/" component={Landing} />
       <Route exact path="/register" component={Register} />
       <Route exact path="/login" component={Login} />
       <Switch>
         <PrivateRoute exact path="/drawRoom" component = {DrawRoom} />
       </Switch>
     </div>
     </Router>
     </Provider>
   );
 }
}

export default App;
