import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Row, Col, Button, Nav, NavItem, NavLink } from "reactstrap";
import { useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";

function Profile() {
  const auth = useAuth();
  
  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const views = ["About", "Ideas", "Collabs", "People"];

  const app = useApp();

  let { userProfileId } = useParams();

  async function getUserById() {
    let response = await axiosCall(
      "get",
      `/users/${userProfileId}`,
      setUserProfile,
      {},
      {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${auth.token}`
      }
    );
    return response;
  }

  useEffect(() => {
    getUserById();
  }, [userProfileId])

  function switchView(view) {
    switch (view) {
      case "About":
        return (
          <p>{userProfile.bio}</p>
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
          <h4>{userProfile.name}</h4>
          <img
            alt=""
            className="img-fluid"
            src={userProfile.image_url || "https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"}></img>
          {
            app.user.id === userProfileId &&
            <Button
              className="mt-3 btn-success">
              Change Pic
            </Button>
          }
        </Col>
        <Col sm="9" style={{textAlign: "left"}}>
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