import React, { useEffect, useState } from "react";
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import { countryCodes } from "../utilities/countryCodes";
import Editable from "./Editable";
import List from "./List";

function Profile() {
  const { token } = useAuth();
  const { user } = useApp();
  let { username, section } = useParams();
  let history = useHistory();

  if (!section) {
    section = "About"
  } else {
    section = (section.charAt(0).toUpperCase() + section.slice(1).toLowerCase())
  }

  useEffect(() => {
    console.log(`section=${section}`)
  })

  const [userProfile, setUserProfile] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [view, setView] = useState(section);
  const views = ["About", "Ideas", "Collabs"];

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

  useEffect(() => {
    getUserByUsername() && setDataLoaded(true);
  }, [username])

  const editables = [
    { name: (userProfile.bio || currentUserProfile) ? "Bio" : null, field: "bio", inputElementType: "textarea", content: userProfile.bio },
    { name: (userProfile.pronouns || currentUserProfile) ? "Pronouns" : null, field: "pronouns", inputElementType: "textarea", content: userProfile.pronouns },
    { name: (userProfile.location || currentUserProfile) ? "Location" : null, field: "location_id", inputElementType: "location", inputOptions: countryCodes, staticElementType: "location", locationData: userProfile.location },
  ]

  function switchView() {
    switch (view) {
      case "About":
        return (
          <Row>
            <Col sm="4">
              <Editable
                canEdit={currentUserProfile}
                table="users"
                rowId={user.id}
                refreshFunction={getUserByUsername}
                staticElementType="img"
                field="image_url"
                content={userProfile.image_url} />
            </Col>
            <Col sm="8">
              {
                editables.map((item, index) => {
                  return (
                    <>
                      {item.name && <h5 className="text-left">{item.name}</h5>}
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
              }
            </Col>
          </Row>
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

  if (Object.keys(userProfile).length > 0) {
    return (
      <>
        <Row>
          <Col className="bg-light">
            <Editable
              canEdit={currentUserProfile}
              table="users"
              rowId={user.id}
              refreshFunction={getUserByUsername}
              staticElementType="h3"
              field="name"
              content={userProfile.name} />
          </Col>
        </Row>
        <Nav
          justified
          tabs
          className="bg-light mb-3">
          {
            views.map((item, index) => {
              return (
                <NavItem
                  key={"button-" + index}>
                  <NavLink
                    className={(view === item) ? "active" : ""}
                    id={item}
                    onClick={() => {
                      setView(item);
                      section = item;
                      history.push(`/users/${username}/${item.toLowerCase()}`)
                    }}>
                    <h5>{item}</h5>
                  </NavLink>
                </NavItem>
              )
            })
          }
        </Nav>
        {switchView()}
      </>
    )
  } else if (!dataLoaded) {
    return (
      <Row>
        <Col>
          <h3 className="text-left">Loading...</h3>
        </Col>
      </Row>
    )
  } else {
    return (
      <div />
    )
  }
}

export default Profile;