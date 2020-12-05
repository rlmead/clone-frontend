import React, { useEffect, useState } from "react";
import { Button, Row, Col, Nav, NavItem, NavLink, Input, ListGroup, ListGroupItem } from "reactstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import { useLocation } from "../utilities/LocationContext";
import { countryCodes } from "../utilities/countryCodes";
import Editable from "./Editable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

function Idea() {
  const { user } = useApp();
  const { token } = useAuth();
  const loc = useLocation();

  let { ideaId } = useParams();

  let history = useHistory();

  const [ideaData, setIdeaData] = useState({});
  const [ideaUsers, setIdeaUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [view, setView] = useState("About");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [relationship, setRelationship] = useState("");
  const views = ["About", "People", "Discussion"];

  let currentUserOwnsIdea = (
    user.id
    && ideaUsers.map(item => item.id).includes(user.id)
    && ideaUsers.filter(item => item.id === user.id)[0].role === "creator");

  let currentUserIsCollaborator = (
    user.id
    && ideaUsers.map(item => item.id).includes(user.id)
    && ideaUsers.filter(item => item.id === user.id)[0].role === "collaborator");

  let collabRequested = (
    user.id
    && ideaUsers.map(item => item.id).includes(user.id)
    && ideaUsers.filter(item => item.id === user.id)[0].role === "request");

  let editables = [
    { table: "ideas", column: "name", element: "h4" }
  ]

  let postHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Bearer ${token}`
  };

  async function getIdeaById() {
    let response = await axiosCall(
      "get",
      `/ideas/${ideaId}`,
      setIdeaData,
      {},
      postHeaders
    );
    return response;
  }

  function parseUserData(input) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
      output.push({
        role: input[i].pivot.user_role,
        id: input[i].id,
        name: input[i].name
      });
    }
    output.sort((a, b) => a.role < b.role ? 1 : -1);
    setIdeaUsers(output);
  }

  async function getIdeaUsers() {
    let response = await axiosCall(
      "post",
      "/ideas/get_users",
      parseUserData,
      {
        id: ideaId
      },
      postHeaders
    );
    return response;
  }

  async function getComments() {
    let response = await axiosCall(
      "get",
      `/comments/${ideaId}`,
      setComments,
      {},
      postHeaders
    );
    return response;
  }

  async function editData(key, value) {
    value !== "" &&
      await axiosCall(
        "post",
        "/ideas/update",
        console.log,
        {
          id: ideaId,
          [key]: value
        },
        postHeaders
      );
  }

  async function requestCollab() {
    await axiosCall(
      "post",
      "/request_collab",
      console.log,
      {
        idea_id: ideaId,
        user_id: user.id,
        user_role: "request"
      },
      postHeaders
    );
  }

  async function saveRelationship(relationshipUser) {
    await axiosCall(
      "post",
      relationship === "reject" ? "/delete_collab" : "/update_collab",
      console.log,
      {
        idea_id: ideaId,
        user_id: relationshipUser,
        user_role: relationship
      },
      postHeaders
    );
  }

  async function addComment() {
    await axiosCall(
      "post",
      "/comments/add",
      console.log,
      {
        idea_id: ideaId,
        user_id: user.id,
        text: newComment
      },
      postHeaders
    );
  }

  async function deleteComment(commentId) {
    await axiosCall(
      "post",
      "/comments/delete",
      console.log,
      {
        id: commentId
      },
      postHeaders
    );
  }

  function editNameKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      editData("name", newName) && getIdeaById();
      setEditingName(!editingName);
    }
  }

  function editDescriptionKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      editData("description", newDescription) && getIdeaById();
      setEditingDescription(!editingDescription);
    }
  }

  function editStatusKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      editData("status", newStatus) && getIdeaById();
      setEditingStatus(!editingStatus);
    }
  }

  function addCommentKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      newComment !== "" && addComment() && getComments();
      setAddingComment(!addingComment);
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
    getIdeaById();
    getIdeaUsers();
    getComments();
  }, [ideaId])

  useEffect(() => {
    if (loc.newLocationId !== "" && editingLocation) {
      console.log("found new location id");
      editData("location_id", loc.newLocationId) && getIdeaById();
    }
    setEditingLocation(false);
  }, [loc.newLocationId])

  useEffect(() => {
    if (loc.localData.length > 0 && editingLocation) {
      console.log("found new local data");
      editData("location_id", loc.localData[0].id) && getIdeaById();
    }
    setEditingLocation(false);
  }, [loc.localData])

  function switchView(view) {
    switch (view) {
      case "About":
        return (
          <>
            <h5>Description</h5>
            {
              !currentUserOwnsIdea &&
              <p>{ideaData.description}</p>
            }
            {
              currentUserOwnsIdea && !editingDescription &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="text-success"
                    onClick={() => setEditingDescription(!editingDescription)}
                  />
                </div>
                <p>{ideaData.description}</p>
              </>
            }
            {
              currentUserOwnsIdea && editingDescription &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faSave}
                    className="text-success"
                    onClick={() => {
                      editData("description", newDescription) && getIdeaById();
                      setEditingDescription(!editingDescription);
                    }}
                  />
                </div>
                <textarea
                  onChange={(e) => setNewDescription(e.target.value)}
                  onKeyPress={(e) => editDescriptionKeyPress(e)}
                  style={{ width: "100%" }}>
                  {ideaData.description}
                </textarea>
              </>
            }
            <h5>Status</h5>
            {
              !currentUserOwnsIdea &&
              <p>{ideaData.status}</p>
            }
            {
              currentUserOwnsIdea && !editingStatus &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="text-success"
                    onClick={() => setEditingStatus(!editingStatus)}
                  />
                </div>
                <p>{ideaData.status}</p>
              </>
            }
            {
              currentUserOwnsIdea && editingStatus &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faSave}
                    className="text-success"
                    onClick={() => {
                      editData("status", newStatus) && getIdeaById();
                      setEditingStatus(!editingStatus);
                    }}
                  />
                </div>
                <Input
                  type="select"
                  name="select"
                  style={{ width: "20%" }}
                  onKeyPress={(e) => editStatusKeyPress(e)}
                  onChange={(e) => e.target.value !== "" && setNewStatus(e.target.value)}>
                  <option></option>
                  <option>open</option>
                  <option>closed</option>
                </Input>
              </>
            }
            {
              (currentUserOwnsIdea || ideaData.location) &&
              <h5>Location</h5>
            }
            {
              (!currentUserOwnsIdea && ideaData.location) &&
              <Link
                to={`/locations/${ideaData.location.city}-${ideaData.location.state}-${ideaData.location.country_code}`}
                className="text-dark"
                style={{ textDecoration: "none" }}>
                <p>{`${ideaData.location.city}, ${ideaData.location.state}, ${ideaData.location.country_code}`}</p>
              </Link>
            }
            {
              (currentUserOwnsIdea && !editingLocation) &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="text-success"
                    onClick={() => setEditingLocation(true)}
                  />
                </div>
                {
                  loc.parsingLocationData &&
                  <p>Loading location data...</p>
                }
                {
                  (ideaData.location && !loc.parsingLocationData) &&
                  <Link
                    to={`/locations/${ideaData.location.city}-${ideaData.location.state}-${ideaData.location.country_code}`}
                    className="text-dark"
                    style={{ textDecoration: "none" }}>
                    <p>{`${ideaData.location.city}, ${ideaData.location.state}, ${ideaData.location.country_code} `}</p>
                  </Link>
                }
              </>
            }
            {
              currentUserOwnsIdea && editingLocation &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faSave}
                    className="text-success"
                    onClick={() => {
                      (loc.newPostalCode && loc.newCountryCode)
                        ? loc.handleLocationInput()
                        : alert("Please enter both a postal code and a country code");
                    }}
                  />
                </div>
                <input
                  type="text"
                  onChange={(e) => loc.setNewPostalCode(e.target.value)}
                  maxLength={64}
                  style={{ width: "20%" }}
                  placeholder="Postal code">
                </input>
                <Input
                  type="select"
                  name="select"
                  style={{ width: "20%" }}
                  onKeyPress={(e) => console.log(e)}
                  onChange={(e) => {
                    loc.setNewCountryCode(e.target.value)
                  }}>
                  {
                    countryCodes.map((item, index) => {
                      return (<option key={`country-${index}`}>{item}</option>)
                    })
                  }
                </Input>
              </>
            }
          </>
        )
      case "People":
        return (
          <ListGroup
            flush
            className='text-left'>
            {
              ideaUsers.map((item, index) => {
                return (
                  (currentUserOwnsIdea
                    || (!currentUserOwnsIdea && item.role !== "request")) &&
                  <ListGroupItem
                    style={{ cursor: "pointer" }}
                    key={`listItem-${index}`}>
                    <Row>
                      <Col sm="8">
                        <h4 onClick={() => history.push(`/users/${item.id}`)}>{item.name}</h4>
                      </Col>
                      <Col sm="4">
                        {
                          item.role === "request"
                            ?
                            <>
                              <Input
                                type="select"
                                name="select"
                                onKeyPress={(e) => console.log(e)}
                                onChange={(e) => {
                                  if (e.target.value === "add collaborator") {
                                    setRelationship("collaborator")
                                  } else if (e.target.value === "add co-creator") {
                                    setRelationship("creator")
                                  } else {
                                    setRelationship(e.target.value)
                                  }
                                }}>
                                <option></option>
                                <option>add collaborator</option>
                                <option>add co-creator</option>
                                <option>reject</option>
                              </Input>
                              <FontAwesomeIcon
                                icon={faSave}
                                className="text-success"
                                onClick={() => {
                                  relationship !== "" &&
                                    saveRelationship(item.id) &&
                                    getIdeaUsers();
                                }}
                              />
                            </>
                            :
                            <h5>{item.role}</h5>
                        }
                      </Col>
                    </Row>
                  </ListGroupItem>
                )
              })
            }
          </ListGroup>
        )
      case "Discussion":
        return (
          <>
            <FontAwesomeIcon
              icon={addingComment ? faSave : faPlus}
              size="2x"
              className="text-success"
              onClick={() => {
                addingComment && newComment !== "" && addComment();
                setAddingComment(!addingComment);
              }}
            />
            {
              addingComment &&
              <textarea
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => addCommentKeyPress(e)}
                style={{ width: "100%" }} />
            }
            <ListGroup
              flush
              className='text-left'>
              {
                comments.map((item, index) => {
                  return (
                    <ListGroupItem
                      key={`listItem-${index}`}>
                      <Row>
                        <Col sm="8">
                          <p>{item.text}</p>
                        </Col>
                        <Col sm="4">
                          <Link
                            to={`/users/${item.users.id}`}
                            className="text-dark"
                            style={{ textDecoration: "none" }}>
                            <h5>{item.users.name}</h5>
                          </Link>
                          <p>{item.updated_at.split('T')[0] + ' ' + item.updated_at.split('T')[1].split('.')[0]}</p>
                          {
                            item.users.id === user.id &&
                            <div className="text-right">
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="text-success"
                                onClick={() => {
                                  deleteComment(item.id) && getComments();
                                }}
                              />
                            </div>
                          }
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )
                })
              }
            </ListGroup>
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
          !currentUserOwnsIdea &&
          <h4>{ideaData.name}</h4>
        }
        {
          currentUserOwnsIdea && !editingName &&
          <>
            <h4>{ideaData.name}</h4>
            <div>
              <FontAwesomeIcon
                icon={faPencilAlt}
                className="text-success"
                onClick={() => setEditingName(!editingName)}
              />
            </div>
          </>
        }
        {
          currentUserOwnsIdea && editingName &&
          <>
            <textarea
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => editNameKeyPress(e)}
              maxLength={255}
              style={{ width: "100%" }}>
              {ideaData.name}
            </textarea>
            <div>
              <FontAwesomeIcon
                icon={faSave}
                className="text-success"
                onClick={() => {
                  editData("name", newName) && getIdeaById();
                  setEditingName(!editingName);
                }}
              />
            </div>
          </>
        }
        <img
          alt=""
          className="img-fluid"
          style={{ height: "auto", width: "100%" }}
          src={ideaData.image_url || "https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80"} />
        {
          currentUserOwnsIdea &&
          <FontAwesomeIcon
            icon={faPencilAlt}
            className="text-success"
            onClick={() => {
              let newUrl = prompt("Please enter a link to your new picture.");
              if (newUrl) {
                if (isValidUrl(newUrl)) {
                  editData("image_url", newUrl) && getIdeaById();
                } else {
                  alert("Whoops, that doesn't look like a valid link!");
                }
              }
            }}
          />
        }
        {
          !currentUserOwnsIdea
          && !currentUserIsCollaborator
          && ideaData.status === "open"
          &&
          <Button
            className="btn-success"
            onClick={() => requestCollab() && getIdeaUsers()}
            disabled={collabRequested}>
            {
              collabRequested
                ? "Collaboration Requested"
                : "Request to Collaborate"
            }
          </Button>
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

export default Idea;