import { React, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AppProvider } from './utilities/AppContext.js';
import { AuthProvider } from "./utilities/AuthContext.js";
import LogIn from './components/LogIn.js';
import SignUp from './components/SignUp.js';
import Profile from './components/Profile.js';
import './theme_1606090074772.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // is this used?
  const initialContext = { 'currentUser': currentUser, 'setCurrentUser': setCurrentUser };

  return (
    <div className="App">
      <AppProvider value={initialContext}>
        <AuthProvider>
          <Container>
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
          </Container>
        </AuthProvider>
      </AppProvider>
    </div>
  );
}

export default App;
