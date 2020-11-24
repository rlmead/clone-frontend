import React, { useState, useContext, createContext } from 'react';
import { useApp } from './AppContext.js';
import { axiosCall } from './axiosCall.js';

const authContext = createContext({});

export default authContext;

const postHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8"
}

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useAuthProvider() {
  const [token, setToken] = useState('');
  
  const app = useApp();

  async function getToken(authData) {
    if (authData.access_token) {
      setToken(authData.access_token);
      await getUser();
    } else if (authData.data.token) {
      setToken(authData.data.token);
      app.setUser(authData.data.user_data);
    } else {
      console.log('error: no token found');
    }
  }

  async function getUser() {
    await axiosCall(
      'post',
      '/users/get_by_email',
      {
        email: app.email
      },
      {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      app.setUser
    );
  }

  async function logIn() {
    await axiosCall(
      'post',
      '/v1/oauth/token',
      {
        grant_type: "password",
        client_id: '2',
        client_secret: "iOgp23lMwnBdyHOmpglk56acuSMGIEAJAmNCPXGq",
        password: app.password,
        username: app.email,
        scope: ""
      },
      postHeaders,
      getToken
    )
  }

  async function signUp(name, emailAddress, password) {
    await axiosCall(
      'post',
      '/register',
      {
        name,
        "username": "ignore_this",
        "email": emailAddress,
        password
      },
      postHeaders,
      getToken
    )
  }

  function signout() {
    setToken('');
  }

  return {
    logIn,
    token,
    signUp,
    signout
  };
}
