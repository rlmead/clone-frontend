import React, { useEffect, useState } from "react";
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { useLocation } from "../utilities/LocationContext";
import { axiosCall } from "../utilities/axiosCall";
import { countryCodes } from "../utilities/countryCodes";
import Editable from "./Editable";
import List from "./List";

function Profile() {
  const { token } = useAuth();
  const { user } = useApp();
  const loc = useLocation();

  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const [editingLocation, setEditingLocation] = useState(false);
  const views = ["About", "Ideas", "Collabs"];

  let { username } = useParams();
  const currentUserProfile = (parseInt(user.id) === parseInt(userProfile.id));

  let postHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Bearer ${token}`
  };

  async function getUserByUsername() {
    let response = await axiosCall(
      "post",
      `/users/get_by_username`,
      setUserProfile,
      {
        username
      },
      postHeaders
    );
    return response;
  }

  async function editProfile(key, value) {
    value !== "" &&
      await axiosCall(
        "post",
        "/users/update",
        console.log,
        {
          id: user.id,
          [key]: value
        },
        postHeaders
      );
  }

  useEffect(() => {
    getUserByUsername();
  }, [username])

  useEffect(() => {
    (loc.newLocationId !== "" && editingLocation) &&
      editProfile("location_id", loc.newLocationId) && getUserByUsername();
    setEditingLocation(false);
  }, [loc.newLocationId])

  useEffect(() => {
    (loc.localData.length > 0 && editingLocation) &&
      editProfile("location_id", loc.localData[0].id) && getUserByUsername();
    setEditingLocation(false);
  }, [loc.localData])

  const editables = {
    main: [
      { field: "name", staticElementType: "h4", content: userProfile.name },
      { field: "image_url", staticElementType: "img", content: userProfile.image_url }
    ],
    about: [
      { name: (userProfile.bio || currentUserProfile) ? "Bio" : null, field: "bio", inputElementType: "textarea", content: userProfile.bio },
      { name: (userProfile.pronouns || currentUserProfile) ? "Pronouns" : null, field: "pronouns", inputElementType: "textarea", content: userProfile.pronouns },
      { name: (userProfile.location || currentUserProfile) ? "Location" : null, field: "location_id", inputElementType: "location", inputOptions: countryCodes, staticElementType: "location", locationData: userProfile.location },
    ]
  }

  function switchView() {
    switch (view) {
      case "About":
        return (
          editables.about.map((item, index) => {
            return (
              <>
                { item.name && <h5>{item.name}</h5>}
                <Editable
                  key={`editable-about-${index}`}
                  canEdit={currentUserProfile}
                  table="users"
                  rowId={user.id}
                  refreshFunction={getUserByUsername}
                  field={item.field}
                  inputElementType={item.inputElementType}
                  content={item.content || null}
                  staticElementType={item.staticElementType || null}
                  inputOptions={item.inputOptions || null}
                  locationData={item.locationData || null} />
              </>
            )
          })
        )
      case "Ideas":
        return (
          <>
            <List type="ideas" route="/users/get_creations" data={{ id: userProfile.id }} />
          </>
        )
      case "Collabs":
        return (
          <List type="ideas" route="/users/get_collaborations" data={{ id: userProfile.id }} />
        )
    }
  };

  return (
    (Object.keys(userProfile).length > 0)
      ?
      <Row>
        <Col sm="3">
          {
            editables.main.map((item, index) => {
              return (
                <>
                  <Editable
                    key={`editable-main-${index}`}
                    canEdit={currentUserProfile}
                    table="users"
                    rowId={user.id}
                    refreshFunction={getUserByUsername}
                    staticElementType={item.staticElementType}
                    field={item.field}
                    content={item.content} />
                </>
              )
            })
          }
        </Col>
        <Col sm="9" style={{ textAlign: "left" }}>
          <Nav
            justified
            tabs
            className="bg-light fixed-bottom">
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
          {switchView()}
        </Col>
      </Row >
      :
      <Row>
        <Col>
          <h3 className="text-left">Loading...</h3>
        </Col>
      </Row>
  )
}

export default Profile;