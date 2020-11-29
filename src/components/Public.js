import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Jumbotron, Row, Col, Input, Button, Card, Label } from "reactstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";

function Public() {
  const app = useApp();
  const auth = useAuth();

  let history = useHistory();

  let { view } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  useEffect(() => {
    auth.justLoggedIn && history.push(`/users/${app.user.id}`);
    auth.setJustLoggedIn(false);
  }, [auth.justLoggedIn])

  function changeStorage() {
    auth.storage === window.sessionStorage
      ? auth.setStorage(window.localStorage)
      : auth.setStorage(window.sessionStorage);
  }

  async function signUp() {
    if (password !== passwordConf) {
      alert("Your passwords don't match! Please try again.");
    } else if (password.length < 8) {
      alert("Please use a password that's at least 8 characters long.");
    } else {
      app.setEmail(email);
      let error = await auth.signUp(name, email, password);
      if (error) {
        switch (error.response.status) {
          case 500:
            alert("There's already an account associated with this email address! Please use a different email address, or log in instead.");
            break;
          case 422:
            alert("Please enter a valid email address.");
            break;
          default:
            alert("There was an error getting you signed up. Please try again or contact an administrator.");
            break;
        }
      }
    }
  }

  function signUpKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (name.length !== 0
        && email.length !== 0
        && password.length !== 0
        && password.length === passwordConf.length) {
        signUp();
      }
    }
  }

  async function logIn() {
    app.setEmail(email);
    let error = await auth.logIn(email, password);
    if (error) {
      alert("Whoops, those credentials didn't work. Please try again, or sign up instead.");
    }
  }

  function logInKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (email.length !== 0 && password.length !== 0) {
        logIn();
      }
    }
  }

  function switchView(view) {
    switch (view) {
      case "signup":
        return (
          <Card
            onKeyPress={signUpKeyPress}>
            {
              auth.token
                ? (
                  <>
                    <h3>You're already logged in!</h3>
                    <Link to="/">
                      <Button
                        className="btn-success"
                        onClick={() => auth.logOut()}>
                        Log out
                    </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <h3>Sign Up</h3>
                    <Input
                      type="text"
                      placeholder="Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Email address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      onChange={(e) => setPasswordConf(e.target.value)}
                    />
                    <Label>
                      <Input
                        type="checkbox"
                        onChange={() => changeStorage()} />
                      Remember me
                    </Label>
                    <Button
                      className="btn-success"
                      onClick={() => signUp()}
                      disabled={
                        name.length === 0
                        || email.length === 0
                        || password.length === 0
                        || password.length !== passwordConf.length}>
                      Create Account
                    </Button>
                  </>
                )
            }
          </Card>
        );
      case "about":
        return (
          <Card style={{ textAlign: "left" }}>
            <h3>About</h3>
            <p>The Idea Network is a social network that allows people to share their creative dreams, and find the collaborators they need to make their dreams happen.</p>
            <p>This website is being created by <a href="https://github.com/rlmead">Becky</a>.</p>
          </Card>
        );
      case "logout":
        return (
          <Card>
            <h3>Goodbye!</h3>
          </Card>
        );
      default:
        return (
          <Card
            onKeyPress={logInKeyPress}>
            <h3>Log in</h3>
            <Input
              type="text"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} />
            <Label>
              <Input
                type="checkbox"
                onChange={() => changeStorage()} />
                Remember me
            </Label>
            <Button
              className="btn-success"
              onClick={() => logIn()}
              disabled={email.length === 0 || password.length === 0}>
              Log in
            </Button>
          </Card>
        );
    }
  };

  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)", backgroundSize: "100%", opacity: "0.8" }}>
        <Row>
          <Col sm={{ size: 10, offset: 1 }}>
            {switchView(view)}
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default Public;