import React, { useState, useEffect, useContext, createContext } from 'react';
import { axiosCall } from './axiosCall.js';

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState(null);

    function updateUser(response) {
        setUser(response);
        console.log(response);
    }

    async function getId(authData) {
        console.log(authData);
        await axiosCall(
            'post',
            '/users/get_id',
            {
                'email': email
            },
            {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            updateUser
        );
    }

    async function signin(emailAddress, password) {
        setEmail(emailAddress);
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
            {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            getId
        )
    }

    // const signin = (email, password) => {
    //     return firebase
    //         .auth()
    //         .signInWithEmailAndPassword(email, password)
    //         .then(response => {
    //             setUser(response.user);
    //             return response.user;
    //         });
    // };

    // const signup = (email, password) => {
    //     return firebase
    //         .auth()
    //         .createUserWithEmailAndPassword(email, password)
    //         .then(response => {
    //             setUser(response.user);
    //             return response.user;
    //         });
    // };

    // const signout = () => {
    //     return firebase
    //         .auth()
    //         .signOut()
    //         .then(() => {
    //             setUser(false);
    //         });
    // };

    // const sendPasswordResetEmail = email => {
    //     return firebase
    //         .auth()
    //         .sendPasswordResetEmail(email)
    //         .then(() => {
    //             return true;
    //         });
    // };

    // const confirmPasswordReset = (code, password) => {
    //     return firebase
    //         .auth()
    //         .confirmPasswordReset(code, password)
    //         .then(() => {
    //             return true;
    //         });
    // };

    // // Subscribe to user on mount
    // // Because this sets state in the callback it will cause any ...
    // // ... component that utilizes this hook to re-render with the ...
    // // ... latest auth object.
    // useEffect(() => {
    //     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    //         if (user) {
    //             setUser(user);
    //         } else {
    //             setUser(false);
    //         }
    //     });

    //     // Cleanup subscription on unmount
    //     return () => unsubscribe();
    // }, []);

    // Return the user object and auth methods
    return {
        user,
        signin
        // signup,
        // signout,
        // sendPasswordResetEmail,
        // confirmPasswordReset
    };
}
