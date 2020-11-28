import React from "react";
import Header from "../components/Header";
import { Jumbotron, Row, Col, Card } from "reactstrap";

function LogOut() {
  return (
    <>
      <Header />
      <Jumbotron
        style={{ backgroundImage: "url(https://images.unsplash.com/photo-1545494097-1545e22ee878?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxzZWFyY2h8OHx8Z2xpdHRlcnxlbnwwfHwwfA%3D%3D&auto=format&fit=crop&w=800&q=60)", backgroundSize: "100%", opacity: "0.8" }}>
        <Row>
          <Col sm={{ size: 6, offset: 3 }}>
            <Card>
              <h3>Goodbye!</h3>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
    </>
  )
}

export default LogOut;