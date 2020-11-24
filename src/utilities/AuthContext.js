import React, { useState, useContext, createContext } from 'react';
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

  function getToken(authData) {
    console.log(authData);
    if (authData.access_token) {
      setToken(authData.access_token);
    } else if (authData.data.token) {
      setToken(authData.data.token);
    } else {
      console.log('error: no token found');
    }
  }

  // TODO : rename getByEmail; create new route to return all profile data based on email; move to a more appropriate file
  // TODO import this function from wherever it gets moved and use it to set user profile data
  async function getId(authData) {
    console.log(authData);
    await axiosCall(
      'post',
      '/users/get_id',
      {
      },
      postHeaders,
      // TODO create new setProfile method
      // updateUser
    );
  }

  async function logIn(emailAddress, password) {
    await axiosCall(
      'post',
      '/v1/oauth/token',
      {
        grant_type: "password",
        client_id: '2',
        client_secret: "iOgp23lMwnBdyHOmpglk56acuSMGIEAJAmNCPXGq",
        password: password,
        username: emailAddress,
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
