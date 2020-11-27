import React, { useState, useContext, createContext } from "react";

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

  return {
    user,
    setUser,
    email,
    setEmail
  };
}
