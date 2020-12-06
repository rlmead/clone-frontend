import React, { useEffect, useState } from "react";
import { Input } from "reactstrap"; import { useApp } from "../utilities/AppContext";
import { Link } from "react-router-dom";
import { useAuth } from "../utilities/AuthContext";
import { useLocation } from "../utilities/LocationContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'

function Editable(props) {
  const { token } = useAuth();
  const { editData, saveRelationship } = useApp();
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
  const [justUpdated, setJustUpdated] = useState(false);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    if (savingUpdate) {
      if (props.inputElementType === "collabRequest") {
        if (newValue !== "") {
          saveRelationship(props.ideaId, props.userId, newValue, token);
          setJustUpdated(true);
        }
      } else if (props.staticElementType === "img" && !isValidUrl(newValue)) {
        alert("Whoops, that doesn't look like a valid link!");
      } else if (newValue !== "") {
        editData(props.table, props.rowId, props.field, newValue, token);
        setNewValue("");
        setSavingUpdate(false);
        setJustUpdated(true);
      } else if (newPostalCode !== "" && newCountryCode !== "") {
        handleLocationInput() && setJustUpdated(true);
      } else if (props.staticElementType === "location") {
        alert("Please enter both a postal code and a country code");
        setNewPostalCode("");
        setNewCountryCode("");
        setSavingUpdate(false);
      }
    }
  }, [savingUpdate])

  useEffect(() => {
    if (localData.length > 0 && savingUpdate) {
      editData(props.table, props.rowId, props.field, localData[0].id, token)
      setJustUpdated(true);
      setSavingUpdate(false);
    }
  }, [localData])

  useEffect(() => {
    if (newLocationId !== "" && savingUpdate) {
      editData(props.table, props.rowId, props.field, newLocationId, token)
      setJustUpdated(true);
      setSavingUpdate(false);
    }
  }, [newLocationId])

  useEffect(() => {
    justUpdated && props.refreshFunction();
    setJustUpdated(false);
  }, [justUpdated])

  function updateKeyPress(e) {
    if (e.key === "Enter" && editingElement) {
      setSavingUpdate(true);
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
          image_url = "https://images.unsplash.com/photo-1529310399831-ed472b81d589?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=634&q=80"
        } else {
          image_url = "https://images.unsplash.com/photo-1490059830487-2f86fddb2b4b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80"
        }
        return (
          <img
            alt=""
            className="img-fluid"
            style={{ height: "auto", width: "100%" }}
            src={image_url} />
        )
      case "h4":
        return (
          <h4>{props.content}</h4>
        )
      case "h4":
        return (
          <h5>{props.content}</h5>
        )
      case "location":
        return (
          props.locationData &&
          <Link
            to={`/locations/${props.locationData.city}-${props.locationData.state}-${props.locationData.country_code}`}
            className="text-dark"
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

  return (
    <>
      {
        props.canEdit &&
        <div>
          <FontAwesomeIcon
            icon={editingElement ? faSave : faPencilAlt}
            className="text-success"
            onClick={() => {
              editingElement && setSavingUpdate(true);
              setEditingElement(!editingElement);
            }}
          />
          {
            editingElement &&
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="text-danger"
              onClick={() => {
                setNewValue("");
                setEditingElement(false);
              }}
            />
          }
        </div>
      }
      {
        editingElement
          ? switchEditingView()
          : switchStaticView()
      }
    </>
  )
}

export default Editable;