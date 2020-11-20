import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  async function getData(path, data) {
    const apiUrl = 'http://localhost:8000';
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8"
    };
    console.log(JSON.stringify(data));
    return await axios({
      method: 'post',
      url: `${apiUrl}${path}`,
      data: JSON.stringify(data),
      headers
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // useEffect(() => {
  //     axios.get(API_URL)
  //       .then(result => setJSONData(result.data))
  //       .catch(e => console.log(e))
  //   }, [])

  return (
    <div className="App">
      <Container>
        <Router>
          <Switch>
            <Route exact path="/">
              <LogIn
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                getData={getData} />
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
