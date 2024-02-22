import { createContext } from "react";

const authContext = createContext({
    error: null,
    isLoggedIn: false,
    logoutUrl: null,
    userData: null
});

export const AuthContext = authContext;
export const AuthProvider = authContext.Provider;
export const AuthConsumer = authContext.Consumer;
