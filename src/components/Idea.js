import React, { useEffect, useState } from "react";
import { Button, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import { useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "../utilities/axiosCall";
import Editable from "./Editable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'

function Idea() {
  const { user } = useApp();
  const { token } = useAuth();
  let { ideaId } = useParams();

  const [ideaData, setIdeaData] = useState({});
  const [view, setView] = useState("About");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const views = ["About", "People", "Skills", "Discussion"];

  let currentUserOwnsIdea = (ideaData.users && ideaData.users.map(x => x.id).includes(user.id));

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

  async function editData(key, value) {
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
  }, [ideaId])

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
                <textarea
                  onChange={(e) => setNewStatus(e.target.value)}
                  onKeyPress={(e) => editStatusKeyPress(e)}
                  style={{ width: "100%" }}>
                  {ideaData.status}
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
    <Row>
      <Col sm="3">
        <img
          alt=""
          className="img-fluid"
          style={{ height: "auto", width: "100%" }}
          src={ideaData.image_url || "https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80"} />
        {
          !currentUserOwnsIdea &&
          <Button className="btn-success">Collaborate</Button>
        }
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

export default Idea;