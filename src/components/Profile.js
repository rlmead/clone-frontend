import React, { useEffect, useState } from "react";
import { Row, Col, Input, Nav, NavItem, NavLink } from "reactstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import { useApp } from "../utilities/AppContext";
import { useAuth } from "../utilities/AuthContext";
import { countryCodes } from "../utilities/countryCodes";
import { axiosCall } from "../utilities/axiosCall";
import { zipCodeBaseKey } from "../utilities/apiKeys";
import List from "./List";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faSave } from '@fortawesome/free-solid-svg-icons'

function Profile() {
  const { token } = useAuth();
  const { user } = useApp();

  const [userProfile, setUserProfile] = useState({});
  const [view, setView] = useState("About");
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [editingPronouns, setEditingPronouns] = useState(false);
  const [newPronouns, setNewPronouns] = useState("");
  const [editingLocation, setEditingLocation] = useState(false);
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [localData, setLocalData] = useState("");
  const [gettingLocationData, setGettingLocationData] = useState(false);
  const [parsingLocationData, setParsingLocationData] = useState(false);
  const [apiData, setApiData] = useState({});
  const views = ["About", "Ideas", "Collabs"];


  let { userProfileId } = useParams();
  let currentUserProfile = user.id == userProfileId;

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
    value != "" &&
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

  async function handleLocationInput() {
    setGettingLocationData(true);
    // check local db for postcode + country
    await axiosCall(
      "post",
      "/locations/get_by_postal_code",
      setLocalData,
      {
        postal_code: newPostalCode,
        country_code: newCountryCode
      },
      postHeaders
    );
  }

  useEffect(() => {
    if (gettingLocationData) {
      setGettingLocationData(false);
      if (localData.length > 0) {
        // if postal code is in local database,
        // use existing id
        editProfile("location_id", localData[0].id) && getUserById();
        setNewPostalCode("");
        setNewCountryCode("");
      } else {
        // if it's not there:
        // getLocationData
        getLocationData();
        setParsingLocationData(true);
      }
    }
  }, [localData])

  useEffect(() => {
    // parse location api data
    if (parsingLocationData) {
      if (Object.keys(apiData).length > 0) {
        let apiObject = apiData.results[Object.keys(apiData.results)[0]][0];
        // add location to local db and get id back
        axiosCall(
          "post",
          "/locations/add",
          tagNewLocation,
          {
            postal_code: apiObject.postal_code,
            city: apiObject.city,
            state: apiObject.state,
            country_code: apiObject.country_code,
            meta: JSON.stringify(apiObject)
          },
          postHeaders
        );
        setParsingLocationData(false);
      } else {
        alert("Whoops, no such postal code found in the database!")
      }
    }
  }, [apiData])

  function tagNewLocation(result) {
    let newLocationId = result.data.id;
    editProfile("location_id", newLocationId) && getUserById();
    setNewPostalCode("");
    setNewCountryCode("");
  }

  async function getLocationData() {
    let response = await axiosCall(
      "get",
      `&codes=${newPostalCode.split(" ").join("%20")}&country=${newCountryCode}`,
      setApiData,
      {},
      postHeaders,
      `https://app.zipcodebase.com/api/v1/search?apikey=${zipCodeBaseKey}`
    );
    return response;
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
            {
              (currentUserProfile || userProfile.location) &&
              <h5>Location</h5>
            }
            {
              (!currentUserProfile && userProfile.location) &&
              <Link
                to={`/locations/${userProfile.location.city}_${userProfile.location.state}_${userProfile.location.country_code}`}
                className="text-dark"
                style={{ textDecoration: "none" }}>
                <p>{`${userProfile.location.city}, ${userProfile.location.state}, ${userProfile.location.country_code}`}</p>
              </Link>
            }
            {
              (currentUserProfile && !editingLocation) &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className="text-success"
                    onClick={() => setEditingLocation(!editingLocation)}
                  />
                </div>
                {
                  parsingLocationData &&
                  <p>Loading location data...</p>
                }
                {
                  (userProfile.location && !parsingLocationData) &&
                  <Link
                    to={`/locations/${userProfile.location.city}_${userProfile.location.state}_${userProfile.location.country_code}`}
                    className="text-dark"
                    style={{ textDecoration: "none" }}>
                    <p>{`${userProfile.location.city}, ${userProfile.location.state}, ${userProfile.location.country_code} `}</p>
                  </Link>
                }
              </>
            }
            {
              currentUserProfile && editingLocation &&
              <>
                <div>
                  <FontAwesomeIcon
                    icon={faSave}
                    className="text-success"
                    onClick={() => {
                      (newPostalCode && newCountryCode)
                        ? handleLocationInput() && setEditingLocation(!editingLocation)
                        : alert("Please enter both a postal code and a country code");
                    }}
                  />
                </div>
                <input
                  type="text"
                  onChange={(e) => setNewPostalCode(e.target.value)}
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
                    setNewCountryCode(e.target.value)
                  }}>
                  {
                    countryCodes.map((item, index) => {
                      return (<option key={`country-${index}`}>{item}</option>)
                    })
                  }
                </Input>
                {/* <input
                  type="text"
                  onChange={(e) => setNewCountryCode(e.target.value)}
                  maxLength={64}
                  style={{ width: "20%" }}
                  placeholder="Country code">
                </input> */}
              </>

            }
          </>
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
          !currentUserProfile &&
          <h4>{userProfile.name}</h4>
        }
        {
          currentUserProfile && !editingName &&
          <>
            <h4>{userProfile.name}</h4>
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
          currentUserProfile && editingName &&
          <>
            <textarea
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => editNameKeyPress(e)}
              maxLength={64}
              style={{ width: "100%" }}>
              {userProfile.name}
            </textarea>
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