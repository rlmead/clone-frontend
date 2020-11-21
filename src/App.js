import { React, useState } from 'react';
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AppProvider } from './utilities/AppContext.js';
import LogIn from './components/LogIn.js';
import SignUp from './components/SignUp.js';
import Profile from './components/Profile.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

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

  const initialContext = { 'currentUser': currentUser, 'setCurrentUser': setCurrentUser, 'getData': getData};

  return (
    <div className="App">
      <AppProvider value={initialContext}>
        <Container>
          <Router>
            <Switch>
              <Route exact path="/">
                <LogIn/>
              </Route>
              <Route path="/signup">
                <SignUp/>
              </Route>
              <Route path={`/users/:userId`}>
                <Profile/>
              </Route>
            </Switch>
          </Router>
        </Container>
      </AppProvider>
    </div>
  );
}

export default App;
