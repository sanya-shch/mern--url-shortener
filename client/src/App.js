import React from 'react';
import {BrowserRouter} from "react-router-dom";
import 'materialize-css';
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";

function App() {
    const {token, login, logout, userId} = useAuth();
    const isAuth = !!token;
    const routes = useRoutes(isAuth);

    return (
        <AuthContext.Provider value={{token, userId, login, logout, isAuth}}>
            <BrowserRouter>
                {isAuth && <Navbar/>}
                <div className='container'>
                    {routes}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
