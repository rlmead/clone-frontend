import React from "react";
import "./theme_1606090074772.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { AppProvider } from "./utilities/AppContext";
import { AuthProvider } from "./utilities/AuthContext";
import { LocationProvider } from "./utilities/LocationContext";
import Header from "./components/Header";
import Public from "./components/Public";
import Profile from "./components/Profile";
import Idea from "./components/Idea";
import IdeaForm from "./components/IdeaForm";
import List from "./components/List";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <AuthProvider>
          <LocationProvider>
            <Router>
              <Header />
              <Container>
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
                  <Route path={`/users`}>
                    <List type="users" route="/users" />
                  </Route>
                  <Route path={`/locations/:locationString`}>
                    <List type="ideas" route="/locations" />
                  </Route>
                  <Route path={`/ideas/new`}>
                    <IdeaForm />
                  </Route>
                  <Route path={`/ideas/:ideaId`}>
                    <Idea />
                  </Route>
                  <Route path={`/ideas`}>
                    <List type="ideas" route="/ideas" />
                  </Route>
                </Switch>
              </Container>
            </Router>
          </LocationProvider>
        </AuthProvider>
      </AppProvider>
    </div>
  );
}

export default App;
