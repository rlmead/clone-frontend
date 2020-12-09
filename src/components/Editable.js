import React, { useEffect, useState } from "react";
import { Input, Row, Col } from "reactstrap";
import { useApp } from "../utilities/AppContext";
import { Link } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";
import { useLocation } from "../utilities/LocationContext";
import Spinners from "./Spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

function Editable(props) {
  const { token } = useAuth();
  const { editData, saveRelationship, response, setResponse } = useApp();
  const {
    newPostalCode,
    setNewPostalCode,
    newCountryCode,
    setNewCountryCode,
    handleLocationInput,
    localData,
    newLocationId
  } = useLocation();

  const [editingElement, setEditingElement] = useState(false);
  const [savingUpdate, setSavingUpdate] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (savingUpdate) {
      if (props.inputElementType === "collabRequest") {
        if (newValue !== "") {
          saveRelationship(props.ideaId, props.userId, newValue, token);
        }
      } else if (props.staticElementType === "img" && !isValidUrl(newValue)) {
        alert("Whoops, that doesn't look like a valid link!");
      } else if (newValue !== "") {
        editData(props.table, props.rowId, props.field, newValue, token);
        setNewValue("");
        setSavingUpdate(false);
        setLoading(false);
      } else if (newPostalCode !== "" && newCountryCode !== "") {
        setResponse(handleLocationInput());
      } else if (props.staticElementType === "location") {
        alert("Please enter both a postal code and a country code");
        setNewPostalCode("");
        setNewCountryCode("");
        setSavingUpdate(false);
        setLoading(false);
      }
    }
  }, [savingUpdate])

useEffect(() => {
  console.log(loading);
}, [loading])

  useEffect(() => {
    if (localData.length > 0 && savingUpdate) {
      editData(props.table, props.rowId, props.field, localData[0].id, token);
      setSavingUpdate(false);
    }
  }, [localData])

  useEffect(() => {
    if (newLocationId !== "" && savingUpdate) {
      editData(props.table, props.rowId, props.field, newLocationId, token);
      setSavingUpdate(false);
    }
  }, [newLocationId])

  useEffect(() => {
    props.refreshFunction() && setLoading(false);
  }, [response])

  function updateKeyPress(e) {
    if (e.key === "Enter" && editingElement) {
      setSavingUpdate(true);
      setLoading(false);
      setEditingElement(false);
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

  function switchStaticView() {
    switch (props.staticElementType) {
      case "img":
        let image_url;
        if (props.content) {
          image_url = props.content;
        } else if (props.table === "ideas") {
          image_url = "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        } else {
          image_url = "https://images.unsplash.com/photo-1589030343991-69ea1433b941?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
        return (
          <img
            alt=""
            className="img-fluid rounded"
            style={{ height: "auto", width: "100%" }}
            src={image_url} />
        )
      case "h2":
        return (
          <h2>{props.content}</h2>
        )
      case "h3":
        return (
          <h3>{props.content}</h3>
        )
      case "h4":
        return (
          <h4>{props.content}</h4>
        )
      case "h5":
        return (
          <h5>{props.content}</h5>
        )
      case "location":
        return (
          props.locationData &&
          <Link
            to={`/locations/${props.locationData.city}-${props.locationData.state}-${props.locationData.country_code}`}
            className="text-primary"
            style={{ textDecoration: "none" }}>
            <p>{`${props.locationData.city}, ${props.locationData.state}, ${props.locationData.country_code}`}</p>
          </Link>
        )
      default:
        return (
          <p>{props.content}</p>
        )
    }
  }

  function switchEditingView() {
    switch (props.inputElementType) {
      case "collabRequest":
        return (
          <Input
            type="select"
            onChange={(e) => {
              if (e.target.value === "add collaborator") {
                setNewValue("collaborator")
              } else if (e.target.value === "add co-creator") {
                setNewValue("creator")
              } else {
                setNewValue(e.target.value)
              }
            }}>
            <option></option>
            <option>add collaborator</option>
            <option>add co-creator</option>
            <option>reject</option>
          </Input>
        )
      case "location":
        return (
          <>
            <Input
              type="text"
              maxLength={64}
              style={{ width: "40%" }}
              placeholder="Postal code"
              onChange={(e) => setNewPostalCode(e.target.value)}
            />
            <Input
              type="select"
              style={{ width: "40%" }}
              onChange={(e) => setNewCountryCode(e.target.value)}>
              {
                props.inputOptions.map((item, index) => {
                  return (<option key={`status-${index}`}>{item}</option>)
                })
              }
            </Input>
          </>
        )
      case "select":
        return (
          <Input
            type="select"
            style={{ width: "20%" }}
            onChange={(e) => setNewValue(e.target.value)}>
            {
              props.inputOptions.map((item, index) => {
                return (<option key={`status-${index}`}>{item}</option>)
              })
            }
          </Input>
        )
      default:
        return (
          <textarea
            defaultValue={props.content}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyPress={(e) => { props.enterKeyUpdate && updateKeyPress(e) }}
            style={{ width: "100%" }} />
        )
    }
  }

  function editButton() {
    return (
      <Col xs="1">
        {
          props.canEdit &&
          <>
            <div>
              <FontAwesomeIcon
                icon={editingElement ? faSave : faPencilAlt}
                size="lg"
                className="text-success"
                onClick={() => {
                  editingElement && setSavingUpdate(true) && setLoading(true);
                  setEditingElement(!editingElement);
                }}
              />
            </div>
            <div>
              {
                editingElement &&
                <FontAwesomeIcon
                  icon={faTimes}
                  className="text-danger"
                  onClick={() => {
                    setNewValue("");
                    setEditingElement(false);
                  }}
                />
              }
            </div>
          </>
        }
      </Col>
    )
  }

  return (
    < Row >
      <>
        { (props.field !== "name") && editButton()}
        <Col xs="11" className={props.field === "name" ? "text-right" : "text-left"}>
          {
            loading
              ? <Spinners />
              : (editingElement
                ? switchEditingView()
                : switchStaticView())
          }
        </Col>
        { (props.field === "name") && editButton()}
      </>
    </Row >
  )
}

export default Editable;