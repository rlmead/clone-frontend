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

  let storedToken = window.localStorage.getItem('token') || "";
  const [token, setToken] = useState(storedToken);

  let storedUser = window.localStorage.getItem('user') || {};
  if (! app.user) {
    app.setUser(storedUser);
  }

  useEffect(() => {
    if (token !== "") {
      let response = getUserByEmail();
      if (response) {
        console.log(response)
      };
    };
    window.localStorage.setItem('token', JSON.stringify(token));
    window.localStorage.setItem('user', JSON.stringify(app.user));
  }, [token])

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
  }

  return {
    token,
    signUp,
    logIn,
    logOut
  };
}
