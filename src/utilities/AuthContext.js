import React, { useState, useContext, createContext } from 'react';
import { axiosCall } from './axiosCall.js';

const authContext = createContext({});

export default authContext;

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function AuthProvider({ children }) {
    const auth = useAuthProvider();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useAuthProvider() {
    const [token, setToken] = useState('');

    function parseToken(authToken) {
        setToken(authToken.accessToken);
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
            {
                Accept: "application/json",
                "Content-Type": "application/json; charset=utf-8"
            },
            // TODO create new setProfile method
            // updateUser
        );
    }

    

    async function signin(emailAddress, password) {
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
            parseToken
        )
    }

    function signout() {
        setToken('');
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
        // user,
        signin,
        token,
        // signup,
        signout,
        // sendPasswordResetEmail,
        // confirmPasswordReset
    };
}
