import React, { useEffect, useState } from "react";
import { Button, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import List from "./List";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'

function Profile() {
  const { token } = useAuth();

  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [editingPronouns, setEditingPronouns] = useState(false);
  const [newPronouns, setNewPronouns] = useState("");
  const views = ["About", "Ideas", "Collabs", "People"];

  const app = useApp();

  let { userProfileId } = useParams();
  let currentUserProfile = app.user.id == userProfileId;

  let history = useHistory();

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
    await axiosCall(
      "post",
      "/users/update",
      console.log,
      {
        id: app.user.id,
        [key]: value
      },
      postHeaders
    );
  }

  function editNameKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      editProfile("name", newName) && getUserById();
      setEditingName(!editingName);
    }
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

  function isValidUrl(string) {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }
    return true;
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
              !currentUserProfile &&
              <p>{userProfile.bio}</p>
            }
            {
              currentUserProfile && !editingBio &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="text-success"
                    onClick={() => setEditingBio(!editingBio)}
                  />
                </div>
                <p>{userProfile.bio}</p>
              </>
            }
            {
              currentUserProfile && editingBio &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faSave}
                    className="text-success"
                    onClick={() => {
                      editProfile("bio", newBio) && getUserById();
                      setEditingBio(!editingBio);
                    }}
                  />
                </div>
                <textarea
                  onChange={(e) => setNewBio(e.target.value)}
                  onKeyPress={(e) => editBioKeyPress(e)}
                  style={{ width: "100%" }}>
                  {userProfile.bio}
                </textarea>
              </>
            }
            <h5>Pronouns</h5>
            {
              !currentUserProfile &&
              <p>{userProfile.pronouns}</p>
            }
            {
              currentUserProfile && !editingPronouns &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="text-success"
                    onClick={() => setEditingPronouns(!editingPronouns)}
                  />
                </div>
                <p>{userProfile.pronouns}</p>
              </>
            }
            {
              currentUserProfile && editingPronouns &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faSave}
                    className="text-success"
                    onClick={() => {
                      editProfile("pronouns", newPronouns) && getUserById();
                      setEditingPronouns(!editingPronouns);
                    }}
                  />
                </div>
                <textarea
                  onChange={(e) => setNewPronouns(e.target.value)}
                  onKeyPress={(e) => editPronounsKeyPress(e)}
                  maxLength={64}
                  style={{ width: "100%" }}>
                  {userProfile.pronouns}
                </textarea>
              </>
            }
          </>
        )
      case "Ideas":
        return (
          <>
            <Button
              className="btn-success text-dark"
              onClick={() => history.push("/ideas/new")}>
              Add a new idea
            </Button>
            <List type="ideas" route="/ideas/index_by_user" data={{ user: userProfileId }} />
          </>
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
          !currentUserProfile &&
          <h4>{userProfile.name}</h4>
        }
        {
          currentUserProfile && !editingName &&
          <>
            <div>
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="text-success"
                onClick={() => setEditingName(!editingName)}
              />
            </div>
            <h4>{userProfile.name}</h4>
          </>
        }
        {
          currentUserProfile && editingName &&
          <>
            <div>
              <FontAwesomeIcon
                icon={faSave}
                className="text-success"
                onClick={() => {
                  editProfile("name", newName) && getUserById();
                  setEditingName(!editingName);
                }}
              />
            </div>
            <textarea
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => editNameKeyPress(e)}
              maxLength={64}
              style={{ width: "100%" }}>
              {userProfile.name}
            </textarea>
          </>
        }
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
              if (newUrl) {
                if (isValidUrl(newUrl)) {
                  editProfile("image_url", newUrl) && getUserById();
                } else {
                  alert("Whoops, that doesn't look like a valid link!");
                }
              }
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
  )
}

export default Profile;