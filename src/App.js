import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "reactstrap";
import { AppProvider } from "./utilities/AppContext";
import { AuthProvider } from "./utilities/AuthContext";
import { LocationProvider } from "./utilities/LocationContext";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import Public from "./components/Public";
import Profile from "./components/Profile";
import Idea from "./components/Idea";
import Browse from "./components/Browse";
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
              <Container className="p-0 bg-white">
                <Switch>
                  <Route exact path="/">
                    <Public />
                  </Route>
                  <Route path="/public/:view">
                    <Public />
                  </Route>
                  <Route path={`/browse`}>
                    <Browse />
                  </Route>
                  <Route path={`/locations/:locationString`}>
                    <List type="ideas" route="/locations" />
                  </Route>
                  <PrivateRoute path={`/users/:username/:section`}>
                    <Profile />
                  </PrivateRoute>
                  <PrivateRoute path={`/users/:username/`}>
                    <Profile />
                  </PrivateRoute>
                  <PrivateRoute path={`/ideas/new`}>
                    <IdeaForm />
                  </PrivateRoute>
                  <PrivateRoute path={`/ideas/:ideaId/:section`}>
                    <Idea />
                  </PrivateRoute>
                  <PrivateRoute path={`/ideas/:ideaId`}>
                    <Idea />
                  </PrivateRoute>
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
