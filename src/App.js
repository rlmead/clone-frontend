import './App.css';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import Profile from './Profile.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
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
