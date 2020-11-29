import React, { useState } from "react";
import Header from "../components/Header";
import { Row, Col, Button, Nav, NavItem, NavLink } from "reactstrap";
import { useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";

function Profile() {
  const [view, setView] = useState("About");
  const views = ["About", "Ideas", "Collabs", "People"];

  const app = useApp();

  let { userId } = useParams();

  function switchView(view) {
    switch (view) {
      case "About":
        return (
          <h3>{"user #" + userId}</h3>
        )
      default:
        return (
          <p>under construction</p>
        )
    }
  };

  return (
    <>
      <Header />
      <Row>
        <Col sm="3">
          <img
            alt=""
            className="img-fluid"
            src="https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"></img>
          <Button className="mt-3 btn-success">Change Pic</Button>
        </Col>
        <Col sm="9">
          <Nav
            justified
            tabs
            className="bg-light">
            {
              views.map((item, index) => {
                return (
                  <NavItem
                    key={"button-" + index}>
                    <NavLink
                      className={(view === item) ? "active" : ""}
                      id={item}
                      onClick={() => setView(item)}>
                      <h5>{item}</h5>
                    </NavLink>
                  </NavItem>
                )
              })
            }
          </Nav>
          {switchView(view)}
        </Col>
      </Row>
    </>
  )
}

export default Profile;