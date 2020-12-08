import React from "react";
import { Nav, Row, Col } from "reactstrap";

function Footer(props) {
  return (
    <>
      <div className="m-4 text-white"> . </div>
      <div className="m-4 text-white"> . </div>
      <Nav className="fixed-bottom bg-primary text-white pt-3 pr-3">
        <Row className="ml-auto pr-5">
          <Col>
            <h2>{props.text}</h2>
          </Col>
        </Row>
      </Nav>
    </>
  )
}

export default Footer;