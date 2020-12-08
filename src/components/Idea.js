import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Row, Col, Nav, NavItem, NavLink, ListGroup, ListGroupItem } from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import { countryCodes } from "../utilities/countryCodes";
import Editable from "./Editable";

function Idea() {
  const { user } = useApp();
  const { token } = useAuth();
  let { ideaId, section } = useParams();
  let history = useHistory();

  const [ideaData, setIdeaData] = useState({});
  const [ideaUsers, setIdeaUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [addingComment, setAddingComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [deletingIdea, setDeletingIdea] = useState(false);

  const views = ["About", "People", "Discussion"];
  const [view, setView] = useState(views[0]);

  useEffect(() => {
    if (!section) {
      section = views[0];
    } else {
      section = section.charAt(0).toUpperCase() + section.slice(1).toLowerCase();
    }
    setView(section);
  })

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
        username: input[i].username,
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

  function addCommentKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      newComment !== "" && addComment() && getComments();
      setAddingComment(!addingComment);
    }
  }

  useEffect(() => {
    getIdeaById();
    getIdeaUsers();
    getComments();
  }, [ideaId])

  const editables = [
    { name: (ideaData.description || currentUserOwnsIdea) ? "Description" : null, field: "description", inputElementType: "textarea", content: ideaData.description },
    { name: (ideaData.status || currentUserOwnsIdea) ? "Status" : null, field: "status", inputElementType: "select", content: ideaData.status, inputOptions: ["", "open", "closed"] },
    { name: (ideaData.location || currentUserOwnsIdea) ? "Location" : null, field: "location_id", inputElementType: "location", inputOptions: countryCodes, staticElementType: "location", locationData: ideaData.location },
  ]

  function switchView() {
    switch (view) {
      case "About":
        return (
          <Row className="pl-3">
            <Col sm="4">
              <Editable
                canEdit={currentUserOwnsIdea}
                table="ideas"
                rowId={ideaId}
                refreshFunction={getIdeaById}
                field="image_url"
                content={ideaData.image_url}
                staticElementType="img" />
            </Col>
            <Col sm="8">
              {
                !currentUserOwnsIdea && !currentUserIsCollaborator && ideaData.status === "open" &&
                <Button
                  className="btn-success mt-1 mb-4"
                  onClick={() => requestCollab() && getIdeaUsers()}
                  disabled={collabRequested}>
                  {
                    collabRequested
                      ? "Collaboration Requested"
                      : "Request to Collaborate"
                  }
                </Button>
              }
              {
                editables.map((item, index) => {
                  return (
                    <>
                      {item.name && <h5 className="text-left">{item.name}</h5>}
                      <Editable
                        key={`editable-about-${index}`}
                        canEdit={currentUserOwnsIdea}
                        table="ideas"
                        rowId={ideaId}
                        refreshFunction={getIdeaById}
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
                  (currentUserOwnsIdea && deletingIdea) &&
                  <FontAwesomeIcon
                    icon={faTimes}
                    size="lg"
                    className="text-success"
                    onClick={() => setDeletingIdea(false)}
                  />
                }
                {
                  currentUserOwnsIdea &&
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size="lg"
                    className="text-danger ml-3"
                    onClick={() => {
                      if (deletingIdea) {
                        axiosCall(
                          "post",
                          `/ideas/delete`,
                          console.log,
                          {
                            id: ideaId
                          },
                          postHeaders
                        )
                          && history.push("/idea-deleted");
                      }
                      else {
                        setDeletingIdea(!deletingIdea)
                      }
                    }}
                  />
                }
              </div>
              {
                deletingIdea &&
                <div className="bg-danger text-white p-2 text-center">
                  Are you sure you want to delete this idea?
                </div>
              }
            </Col>
          </Row>
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
                    key={`listItem-${index}`}>
                    <Row>
                      <Col
                        xs="7"
                        style={{ cursor: "pointer" }}
                        onClick={() => history.push(`/users/${item.username}`)}>
                        <h4>{item.name}</h4>
                      </Col>
                      <Col xs="5">
                        <Editable
                          canEdit={(currentUserOwnsIdea && item.role === "request")}
                          content={item.role}
                          staticElementType="h4"
                          inputElementType="collabRequest"
                          ideaId={ideaId}
                          userId={item.id}
                          refreshFunction={getIdeaUsers} />
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
          <div className="text-center">
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
                            to={`/users/${item.users.username}`}
                            className="text-primary"
                            style={{ textDecoration: "none" }}>
                            <h5>{item.users.name}</h5>
                          </Link>
                          <p>{item.updated_at.split('T')[0] + ' ' + item.updated_at.split('T')[1].split('.')[0]}</p>
                          {
                            item.users.id === user.id &&
                            <div className="text-right">
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="text-danger"
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
          </div>
        )
    }
  };

  if (Object.keys(ideaData).length > 0) {
    return (
      <>
        <Nav
          justified
          tabs
          className="text-primary bg-white mb-3">
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
                      history.push(`/ideas/${ideaId}/${item.toLowerCase()}`);
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
        <div className="fixed-bottom text-primary bg-white pt-3">
          <Editable
            canEdit={currentUserOwnsIdea}
            table="ideas"
            rowId={ideaId}
            refreshFunction={getIdeaById}
            field="name"
            content={ideaData.name}
            staticElementType="h2" />
        </div>
      </>
    )
  } else {
    return (
      <div />
    )
  }
}

export default Idea;