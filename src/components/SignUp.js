import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Row, Col, Input, Button, Jumbotron, Card } from "reactstrap";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import Header from "../components/Header";

function SignUp() {
  const app = useApp();
  const auth = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConf, setPasswordConf] = useState("");

  let history = useHistory();

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

  // this doesn't work properly when auth.token is listed as a dependency,
  // but react complains that it should be listed
  useEffect(() => {
    auth.token !== "" && history.push(`/users/${app.user.id}`);
  }, [app.user])

  function handleKeyPress(e) {
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

  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)", backgroundSize: "100%", opacity: "0.8" }}>
        <Row>
          <Col sm="6" className="offset-sm-3">
            <Card
              onKeyPress={handleKeyPress}>
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
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default SignUp;