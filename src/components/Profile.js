import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import { countryCodes } from "../utilities/countryCodes";
import Editable from "./Editable";
import List from "./List";
import Spinners from "./Spinners";

function Profile() {
  const { token, logOut } = useAuth();
  const { user } = useApp();
  let { username, section } = useParams();
  let history = useHistory();
  const views = ["About", "Ideas", "Collabs"];
  const [view, setView] = useState(views[0]);

  useEffect(() => {
    if (!section) {
      section = views[0];
    } else {
      section = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
    }
    setView(section);
  })

  const [userProfile, setUserProfile] = useState({});
  const [deletingAccount, setDeletingAccount] = useState(false);
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
    getUserByUsername();
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
          <Row className="bg-white mt-3 mr-0 ml-0">
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
              <div className="text-right p-3">
                {
                  (currentUserProfile && deletingAccount) &&
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    className="text-success"
                    onClick={() => setDeletingAccount(false)}
                  />
                }
                {
                  currentUserProfile &&
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size="lg"
                    className="text-danger ml-3"
                    onClick={() => {
                      if (deletingAccount) {
                        axiosCall(
                          "post",
                          `/users/delete`,
                          console.log,
                          {
                            id: user.id
                          },
                          postHeaders
                        )
                          && logOut()
                          && history.push("/account-deleted");
                      }
                      else {
                        setDeletingAccount(!deletingAccount)
                      }
                    }}
                  />
                }
              </div>
              {
                deletingAccount &&
                <div className="bg-danger text-white p-2 text-center">
                  Are you sure you want to delete your account?
                </div>
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
        <Nav
          justified
          tabs
          className="text-primary">
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
        <div className="m-4 text-white"> . </div>
        <div className="m-4 text-white"> . </div>
        <div className="fixed-bottom text-primary bg-white pt-3 pr-3 ml-auto">
          <Editable
            canEdit={currentUserProfile}
            table="users"
            rowId={user.id}
            refreshFunction={getUserByUsername}
            staticElementType="h2"
            field="name"
            content={userProfile.name} />
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="mt-4" />
        <Spinners />
      </>
    )
  }
}

export default Profile;