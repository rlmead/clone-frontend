import { React, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { AppProvider } from './utilities/AppContext.js';
import LogIn from './components/LogIn.js';
import SignUp from './components/SignUp.js';
import Profile from './components/Profile.js';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const initialContext = { 'currentUser': currentUser, 'setCurrentUser': setCurrentUser};

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
