import React from "react";
import "./theme_1606090074772.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { AppProvider } from "./utilities/AppContext";
import { AuthProvider, useAuth } from "./utilities/AuthContext";
import Public from "./components/Public";
import Profile from "./components/Profile";

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
                      : <Public />
                  }
                </Route>
                <Route path="/public/:view">
                  <Public />
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
