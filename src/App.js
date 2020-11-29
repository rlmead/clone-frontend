import React from "react";
import "./theme_1606090074772.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { AppProvider } from "./utilities/AppContext";
import { AuthProvider } from "./utilities/AuthContext";
import Public from "./components/Public";
import Profile from "./components/Profile";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <AuthProvider>
          <Container>
            <Router>
              <Switch>
                <Route exact path="/">
                  <Public />
                </Route>
                <Route path="/public/:view">
                  <Public />
                </Route>
                <Route path={`/users/:userProfileId`}>
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
