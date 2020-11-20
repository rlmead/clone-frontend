import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';

function App() {
  // const [JSONData, setJSONData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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
      <Container>
        <Router>
          <Switch>
            <Route exact path="/">
              <LogIn currentUser={currentUser} />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path={`/users/:userId`}>
              <Profile currentUser={currentUser} />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
