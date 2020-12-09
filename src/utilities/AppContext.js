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
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState({});

  async function editData(table, id, key, value, token) {
    value !== "" &&
      await axiosCall(
        "post",
        `/${table}/update`,
        setResponse,
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

  async function saveRelationship(idea_id, user_id, user_role, token) {
    await axiosCall(
      "post",
      user_role === "reject" ? "/delete_collab" : "/update_collab",
      setResponse,
      {
        idea_id,
        user_id,
        user_role
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
    username,
    setUsername,
    editData,
    saveRelationship,
    response,
    setResponse
  };
}
