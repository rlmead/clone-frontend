import React, { useEffect, useState, useContext, createContext } from "react";
import { useApp } from "./AppContext";
import { axiosCall } from "./axiosCall";
import { clientSecret } from "./apiKeys";

const authContext = createContext({});

export default authContext;

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useAuthProvider() {
  const {user, setUser, username, setUsername} = useApp();

  const [storage, setStorage] = useState(window.sessionStorage);

  let storedToken = JSON.parse(window.localStorage.getItem('token')) || JSON.parse(window.sessionStorage.getItem('token')) || "";
  const [token, setToken] = useState(storedToken);

  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    if (token !== "") {
      let response = getUserByUsername();
      if (response) {
        console.log(response)
      };
    };
    storage.setItem('token', JSON.stringify(token));
  }, [token])

  let storedUser = JSON.parse(window.localStorage.getItem('user')) || JSON.parse(storage.getItem('user')) || {};
  if (Object.keys(user).length === 0 && Object.keys(storedUser).length > 0) {
    setUser(storedUser);
  }

  useEffect(() => {
    if (typeof user === "object" && Object.keys(user).length > 0) {
      storage.setItem('user', JSON.stringify(user));
      setJustLoggedIn(true);
    }
  }, [user])

  async function getToken(authData) {
    // login
    if (authData.access_token) {
      setToken(authData.access_token);
      // signup
    } else if (authData.data.token) {
      setToken(authData.data.token);
    } else {
      console.log("error: no token found");
    }
  }

  async function signUp(name, inputUsername, password) {
    let response = await axiosCall(
      "post",
      "/register",
      getToken,
      {
        name,
        username: inputUsername,
        password
      }
    );
    return response;
  }

  async function getUserByUsername() {
    let response = await axiosCall(
      "post",
      "/users/get_by_username",
      setUser,
      {
        username
      },
      {
        "Accept": "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Authorization": `Bearer ${token}`
      }
    );
    return response;
  }

  async function logIn(username, password) {
    let response = await axiosCall(
      "post",
      "/v1/oauth/token",
      getToken,
      {
        grant_type: "password",
        client_id: "2",
        client_secret: clientSecret,
        password,
        username,
        scope: ""
      }
    );
    return response;
  }

  async function logOut() {
    setToken("");
    setUser({});
    setUsername("");
    setJustLoggedIn(false);
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  return {
    storage,
    setStorage,
    token,
    signUp,
    logIn,
    logOut,
    justLoggedIn,
    setJustLoggedIn
  };
}
