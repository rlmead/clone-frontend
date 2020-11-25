import React, { useState, useContext, createContext } from 'react';

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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return {
        user,
        setUser,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword
    };
}
