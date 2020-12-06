import React, { useEffect, useState, useContext, createContext } from "react";
import { useAuth } from "../utilities/AuthContext";
import { axiosCall } from "./axiosCall";
import { zipCodeBaseKey } from "../utilities/apiKeys";

const locationContext = createContext({});

export default locationContext;

export function LocationProvider({ children }) {
  const location = useLocationProvider();
  return <locationContext.Provider value={location}>{children}</locationContext.Provider>;
}

export const useLocation = () => {
  return useContext(locationContext);
};

function useLocationProvider() {
  const [editingProfile, setEditingProfile] = useState(false);
  const [gettingLocationData, setGettingLocationData] = useState(false);
  const [parsingLocationData, setParsingLocationData] = useState(false);
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newLocationId, setNewLocationId] = useState("");
  const [localData, setLocalData] = useState({});
  const [apiData, setApiData] = useState({});

  let { token } = useAuth();

  let postHeaders = {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Authorization": `Bearer ${token}`
  };

  async function handleLocationInput() {
    setGettingLocationData(true);
    console.log("iiii see your location updates");
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
    // parse location api data
    if (parsingLocationData) {
      if (Object.keys(apiData.results).length > 0) {
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
      } else {
        alert("Whoops, no such postal code found in the database!")
      }
      setParsingLocationData(false);
    }
  }, [apiData])

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

  useEffect(() => {
    if (gettingLocationData) {
      setGettingLocationData(false);
      if (localData.length > 0) {
        // if postal code is in local database,
        // use existing id
        setNewPostalCode("");
        setNewCountryCode("");
      } else {
        // if it's not there:
        getLocationData();
        setParsingLocationData(true);
      }
    }
  }, [localData])

  function tagNewLocation(result) {
    setNewLocationId(result.data.id);
    setNewPostalCode("");
    setNewCountryCode("");
  }

  return {
    parsingLocationData,
    newPostalCode,
    setNewPostalCode,
    newCountryCode,
    setNewCountryCode,
    handleLocationInput,
    localData,
    setLocalData,
    newLocationId,
    setNewLocationId,
    editingProfile,
    setEditingProfile
  }
}