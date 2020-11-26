import React from 'react';
import './theme_1606090074772.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AppProvider } from './utilities/AppContext.js';
import { AuthProvider, useAuth } from "./utilities/AuthContext.js";
import LogIn from './components/LogIn.js';
import SignUp from './components/SignUp.js';
import Profile from './components/Profile.js';

function App() {
  const auth = useAuth();
  return (
    <div className="App">
      <AppProvider>
        <AuthProvider>
          <Container>
            <Router>
              <Switch>
                <Route exact path="/">
                  {
                    auth.token
                      ? <Profile />
                      : <LogIn />
                  }
                </Route>
                <Route path="/signup">
                  <SignUp />
                </Route>
                <Route path={`/users/:userId`}>
                  <Profile />
                </Route>
              </Switch>
            </Router>
          </Container>
        </AuthProvider>
      </AppProvider>
    </div>
  );
}

export default App;
