import React, { useEffect, useState } from "react";
import { Row, Col, Input, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { useLocation } from "../utilities/LocationContext";
import { axiosCall } from "../utilities/axiosCall";
import { countryCodes } from "../utilities/countryCodes";
import Editable from "./Editable";
import List from "./List";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'

function Profile() {
  const { token } = useAuth();
  const { user } = useApp();
  const loc = useLocation();

  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [editingPronouns, setEditingPronouns] = useState(false);
  const [newPronouns, setNewPronouns] = useState("");
  const [editingLocation, setEditingLocation] = useState(false);
  const views = ["About", "Ideas", "Collabs"];

  let { userProfileId } = useParams();
  const currentUserProfile = (parseInt(user.id) === parseInt(userProfileId));

  let postHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Bearer ${token}`
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

  function editBioKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      editProfile("bio", newBio) && getUserById();
      setEditingBio(!editingBio);
    }
  }

  function editPronounsKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      editProfile("pronouns", newPronouns) && getUserById();
      setEditingPronouns(!editingPronouns);
    }
  }

  useEffect(() => {
    getUserById();
  }, [userProfileId])

  useEffect(() => {
    (loc.newLocationId !== "" && editingLocation) &&
      editProfile("location_id", loc.newLocationId) && getUserById();
    setEditingLocation(false);
  }, [loc.newLocationId])

  useEffect(() => {
    (loc.localData.length > 0 && editingLocation) &&
      editProfile("location_id", loc.localData[0].id) && getUserById();
    setEditingLocation(false);
  }, [loc.localData])

  const editables = {
    main: [
      { field: "name", staticElementType: "h4", content: userProfile.name },
      { field: "image_url", staticElementType: "img", content: userProfile.image_url }
    ],
    about: [
      { name: "Bio", field: "bio", inputElementType: "textarea", content: userProfile.bio },
      { name: "Pronouns", field: "pronouns", inputElementType: "textarea", content: userProfile.pronouns },
      { name: (userProfile.location || currentUserProfile) ? "Location" : null, field: "location_id", inputElementType: "location", inputOptions: countryCodes, staticElementType: "location", locationData: userProfile.location },
    ]
  }

  function switchView(view) {
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
                  refreshFunction={getUserById}
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
        <List type="ideas" route="/users/get_creations" data={{ id: userProfileId }} />
      </>
    )
      case "Collabs":
    return (
      <List type="ideas" route="/users/get_collaborations" data={{ id: userProfileId }} />
    )
      default:
    return (
      <p>under construction</p>
    )
  }
};

return (
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
                refreshFunction={getUserById}
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
      {switchView(view)}
    </Col>
  </Row >
)
}

export default Profile;