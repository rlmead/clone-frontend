import React, { useEffect, useState } from "react";
import Header from "../components/Header.js";
import { Jumbotron, Row, Col, Input, Button, Card } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { useApp } from "../utilities/AppContext.js";
import { useAuth } from "../utilities/AuthContext.js";

function LogIn() {
  const app = useApp();
  const auth = useAuth();

  let history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function logIn() {
    app.setEmail(email);
    await auth.logIn(email, password);
    // is this necessary? or does this variable get obliterated when we leave the page?
    setPassword("");
  }

  // this doesn't work properly when auth.token is listed as a dependency,
  // but react complains that it should be listed
  useEffect(() => {
    auth.token !== "" && history.push(`/users/${app.user.id}`);
  }, [app.user])

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (email.length !== 0 && password.length !== 0) {
        logIn();
      }
    }
  }

  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)", backgroundSize: "100%", opacity: "0.8" }}>
        <Row>
          <Col sm="6">
            <Card
              onKeyPress={handleKeyPress}>
              <h3>Log in</h3>
              <Input
                type="text"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)} />
              <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />
              <Button
                className="btn-success"
                onClick={() => logIn()}
                disabled={email.length === 0 || password.length === 0}>
                Log in
              </Button>
            </Card>
          </Col>
          <Col sm="6">
            <Card>
              <h3>Not a member?</h3>
              <Row>
                <Col>
                  <Link to="signup">
                    <Button
                      className="btn-success">
                      Sign up
                                </Button>
                  </Link>
                </Col>
              </Row>
              <h3>or</h3>
              <Row>
                <Col>
                  <Link to="users">
                    <Button
                      className="btn-success">
                      Browse anonymously
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default LogIn;