import React, {useEffect, useState} from "react";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";
import {useAuth} from "../hooks/auth.hook";

export const AuthPage = () => {
    const auth = useAuth();
    const message = useMessage();
    const {loading, error, request, clearError} = useHttp();
    const [value, setValue] = useState({email: '', password: ''});

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    const changeHandler = e => {
        setValue({ ...value, [e.target.name]: e.target.value})
    };

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...value});
            message(data.message);
        } catch (e) {

        }
    };

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...value});
            auth.login(data.token, data.userId);
        } catch (e) {

        }
    };

    return (
        <div className='row'>
            <div className='col s6 offset-s3'>
                <h1>Auth Page</h1>
                <div className="card blue-grey darken-3">
                    <div className="card-content white-text">
                        <span className="card-title">Authorization</span>
                        <div>
                            <div className="input-field">
                                <input value={value.email} onChange={changeHandler} id="email" type="email" name="email" className='white-text'/>
                                    <label htmlFor="email" className='white-text'>Email</label>
                            </div>
                            <div className="input-field">
                                <input value={value.password} onChange={changeHandler} id="password" type="password" name="password" className='white-text'/>
                                    <label htmlFor="password" className='white-text'>Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button className='btn yellow darken-4' style={ {marginRight: 10} } onClick={loginHandler} disabled={loading}>Login</button>
                        <button className='btn grey lighten-3 black-text' onClick={registerHandler} disabled={loading}>Registration</button>
                    </div>
                </div>
            </div>
        </div>
    )
};