import React, { useState, useContext, createContext } from "react";
import { axiosCall } from "./axiosCall";

const appContext = createContext({});

export default appContext;

export function AppProvider({ children }) {
  const app = useAppProvider();
  return <appContext.Provider value={app}>{children}</appContext.Provider>;
}

export const useApp = () => {
  return useContext(appContext);
};

function useAppProvider() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState("");

  async function editData(table, id, key, value, token) {
    value !== "" &&
      await axiosCall(
        "post",
        `/${table}/update`,
        console.log,
        {
          id,
          [key]: value
        },
        {
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${token}`
        }
      );
  }

  return {
    user,
    setUser,
    email,
    setEmail,
    editData
  };
}
