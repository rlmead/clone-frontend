import React, { useEffect, useState } from "react";
import { Jumbotron, Row, Col, Input, Button, Card, Label } from "reactstrap";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";

function Public() {
  const { setUsername } = useApp();
  const auth = useAuth();

  let location = useLocation();
  let history = useHistory();

  let { from } = location.state || { from: { pathname: "/" } };

  let { view } = useParams();

  const [name, setName] = useState("");
  const [localUsername, setLocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  useEffect(() => {
    setName("")
    setLocalUsername("")
    setPassword("")
    setPasswordConf("")
  }, [view])

  useEffect(() => {
    auth.justLoggedIn && history.replace(from);
    auth.setJustLoggedIn(false);
  }, [auth.justLoggedIn])

  function changeStorage() {
    auth.storage === window.sessionStorage
      ? auth.setStorage(window.localStorage)
      : auth.setStorage(window.sessionStorage);
  }

  let usernameRe = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

  async function signUp() {
    if (password !== passwordConf) {
      alert("Your passwords don't match! Please try again.");
    } else if (password.length < 8) {
      alert("Please use a password that's at least 8 characters long.");
    } else if (!usernameRe.test(localUsername)) {
      alert("Please enter a username between 8 and 20 alphanumeric characters. Your username can include . and _, but not at the beginning or end.")
    } else {
      setUsername(localUsername);
      let error = await auth.signUp(name, localUsername, password);
      if (error) {
        switch (error.response.status) {
          case 500:
            alert("Looks like there's already an account with that username!");
            break;
          case 422:
            alert("Please enter a valid username.");
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
        && localUsername.length !== 0
        && password.length !== 0
        && password.length === passwordConf.length) {
        signUp();
      }
    }
  }

  async function logIn() {
    setUsername(localUsername);
    let error = await auth.logIn(localUsername, password);
    if (error) {
      alert("Whoops, those credentials didn't work. Please try again, or sign up instead.");
      setUsername("");
      setPassword("");
    }
  }

  function logInKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (localUsername.length !== 0 && password.length !== 0) {
        logIn();
      }
    }
  }

  function switchView(view) {
    switch (view) {
      case "signup":
        return (
          <Card
            className="text-center"
            onKeyPress={signUpKeyPress}>
            <h3>Sign Up</h3>
            <Input
              type="text"
              placeholder="Name"
              maxLength={64}
              onChange={(e) => setName(e.target.value)}
              value={name} />
            <Input
              type="text"
              placeholder="Username"
              maxLength={64}
              onChange={(e) => setLocalUsername(e.target.value)}
              value={localUsername} />
            <Input
              type="password"
              placeholder="Password"
              minLength={8}
              maxLength={64}
              onChange={(e) => setPassword(e.target.value)}
              value={password} />
            <Input
              type="password"
              placeholder="Confirm password"
              minLength={8}
              maxLength={64}
              onChange={(e) => setPasswordConf(e.target.value)}
              value={passwordConf} />
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
                || localUsername.length === 0
                || password.length === 0
                || password.length !== passwordConf.length}>
              Create Account
            </Button>
          </Card>
        );
      case "login":
        return (
          <Card
            className="text-center"
            onKeyPress={logInKeyPress}>
            <h3>Log in</h3>
            <Input
              type="text"
              placeholder="Username"
              maxLength={64}
              onChange={(e) => setLocalUsername(e.target.value)}
              value={localUsername} />
            <Input
              type="password"
              placeholder="Password"
              minLength={8}
              maxLength={64}
              onChange={(e) => setPassword(e.target.value)}
              value={password} />
            <Label>
              <Input
                type="checkbox"
                onChange={() => changeStorage()} />
                Remember me
            </Label>
            <Button
              className="btn-success"
              onClick={() => logIn()}
              disabled={localUsername.length === 0 || password.length === 0}>
              Log in
            </Button>
          </Card>
        );
      case "logout":
        return (
          <Card className="text-center p-3">
            <h3>Goodbye!</h3>
          </Card>
        );
      default:
        return (
          <Card className="text-left p-3">
            <h3>About</h3>
            <p>Idea Network allows people to share their creative dreams and find the collaborators they need to make their dreams happen.</p>
            <p>This website is being created by <a href="https://github.com/rlmead">Becky</a>.</p>
          </Card>
        );
    }
  };

  return (
    <Jumbotron
      className="mt-4 card"
      style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)", backgroundSize: "100%", opacity: "0.8" }}>
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          {switchView(view)}
        </Col>
      </Row>
    </Jumbotron>
  )
}

export default Public;