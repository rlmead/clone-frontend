import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

function Profile() {
  const auth = useAuth();

  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const views = ["About", "Ideas", "Collabs", "People"];

  const app = useApp();

  let { userProfileId } = useParams();
  let currentUserProfile = app.user.id == userProfileId;

  let postHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Bearer ${auth.token}`
  };


  async function getUserById() {
    let response = await axiosCall(
      "get",
      `/users/${userProfileId}`,
      setUserProfile,
      {},
      postHeaders
    );
    return response;
  }

  async function editProfile(key, value) {
    let response = await axiosCall(
      "post",
      "/users/update",
      console.log,
      {
        id: app.user.id,
        [key]: value
      },
      postHeaders
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
          <>
            <h5>Bio</h5>
            {
              currentUserProfile &&
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="text-success"
                onClick={() => console.log("edit bio")}
              />
            }
            <p>{userProfile.bio}</p>
            <h5>Pronouns</h5>
            <p>{userProfile.pronouns}</p>
          </>
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
            style={{ height: "auto", width: "100%" }}
            src={userProfile.image_url || "https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"} />
          {
            currentUserProfile &&
            <FontAwesomeIcon
              icon={faPencilAlt}
              className="text-success"
              onClick={() => {
                let newUrl = prompt("Please enter a link to your new profile picture.");
                newUrl && editProfile("image_url", newUrl) && getUserById();
              }}
            />
          }
        </Col>
        <Col sm="9" style={{ textAlign: "left" }}>
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
      </Row >
    </>
  )
}

export default Profile;