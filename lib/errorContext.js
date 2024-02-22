import { createContext } from "react";

const errorContext = createContext({
    errorData: false,
    errorValue: ""
});

export const ErrorContext = errorContext;
export const ErrorProvider = errorContext.Provider;
export const ErrorConsumer = errorContext.Consumer;
