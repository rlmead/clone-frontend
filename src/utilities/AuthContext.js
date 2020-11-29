import React, { useEffect, useState, useContext, createContext } from "react";
import { useApp } from "./AppContext";
import { axiosCall } from "./axiosCall";

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
  const app = useApp();

  const [storage, setStorage] = useState(window.sessionStorage);

  let storedToken = JSON.parse(window.localStorage.getItem('token')) || JSON.parse(window.sessionStorage.getItem('token')) || "";
  const [token, setToken] = useState(storedToken);

  useEffect(() => {
    if (token !== "") {
      let response = getUserByEmail();
      if (response) {
        console.log(response)
      };
    };
    storage.setItem('token', JSON.stringify(token));
  }, [token])

  let storedUser = JSON.parse(window.localStorage.getItem('user')) || JSON.parse(storage.getItem('user')) || {};
  if (Object.keys(app.user).length === 0 && Object.keys(storedUser).length > 0) {
    app.setUser(storedUser);
  }

  useEffect(() => {
    if (typeof app.user === "object" && Object.keys(app.user).length > 0) {
      storage.setItem('user', JSON.stringify(app.user));
    }
  }, [app.user])

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

  async function signUp(name, email, password) {
    let response = await axiosCall(
      "post",
      "/register",
      getToken,
      {
        name,
        email,
        password
      }
    );
    return response;
  }

  async function getUserByEmail() {
    let response = await axiosCall(
      "post",
      "/users/get_by_email",
      app.setUser,
      {
        email: app.email
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
        client_secret: "tiAugBiLiD9XKo8E69pSSmh0AlnyBOjWNwLmoYh5",
        password,
        username,
        scope: ""
      }
    );
    return response;
  }

  async function logOut() {
    setToken("");
    app.setUser({});
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  return {
    storage,
    setStorage,
    token,
    signUp,
    logIn,
    logOut
  };
}
