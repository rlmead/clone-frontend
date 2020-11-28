import React from "react";
import Header from "../components/Header";
import { Jumbotron, Row, Col, Card } from "reactstrap";

function LogOut() {
  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)", backgroundSize: "100%", opacity: "0.8", textAlign: "left" }}>
        <Row>
          <Col sm={{ size: 10, offset: 1 }}>
            <Card>
              <h3>About</h3>
              <p>The Idea Network is a social network that allows people to share their creative dreams, and find the collaborators they need to make their dreams happen.</p>
              <p>This website is being created by <a href="https://github.com/rlmead">Becky</a>.</p>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default LogOut;