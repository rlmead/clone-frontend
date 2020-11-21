import { React, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import LogIn from './components/LogIn.js';
import SignUp from './components/SignUp.js';
import Profile from './components/Profile.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  console.log(currentUser);
  async function getData(path, data) {
    const apiUrl = 'http://localhost:8000';
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8"
    };
    return await axios({
      method: 'post',
      url: `${apiUrl}${path}`,
      data: JSON.stringify(data),
      headers
    })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });
  }

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
              <SignUp
                currentUser={currentUser}
                setCurrentUser={setCurrentUser} />
            </Route>
            <Route path={`/users/:userId`}>
              <Profile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser} />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
