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
  const { editData } = useApp();
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
      if (newValue !== "") {
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


  function switchStaticView() {
    switch (props.staticElementType) {
      case "location":
        return (
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