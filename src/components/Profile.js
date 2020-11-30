import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'

function Profile() {
  const auth = useAuth();

  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [editingPronouns, setEditingPronouns] = useState(false);
  const [newPronouns, setNewPronouns] = useState("");
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
                  maxLength={255}
                  style={{width: "100%"}}>
                  {userProfile.bio}
                </textarea>
              </>
            }
            <h5>Pronouns</h5>
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
                  style={{width: "100%"}}>
                  {userProfile.pronouns}
                </textarea>
              </>
            }
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
    </>
  )
}

export default Profile;