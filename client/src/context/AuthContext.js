import {createContext} from 'react';

function f() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    login: f,
    logout: f,
    isAuth: false
});