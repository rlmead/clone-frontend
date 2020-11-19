import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';

function App() {
  const [JSONData, setJSONData] = useState(null)

  const API_URL = 'http://localhost:8000';
  
  // useEffect(() => {
//     axios.get(API_URL)
//       .then(result => setJSONData(result.data))
//       .catch(e => console.log(e))
//   }, [])

//   <p>
//   {JSONData ?
//     JSONData
//     : "loading"}
//  </p>

  // const API_Post = () => {
  //   const data = { 'id': 5 };
  //   axios.post(API_URL + '/delete', data)
  //     .then(res => console.log(res))
  //     .catch(e => console.log(e))
  // }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <LogIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path={`/users/:userId`}>
            <Profile />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
