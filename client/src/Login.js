// src/Register.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { loginSuccess } from './features/Users';
import { useNavigate } from 'react-router-dom';
import UserProfile from './personallArea';
const Login = () => {
    // סטייט לטופס
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const dispatch = useDispatch()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const navigae = useNavigate()

    const login = async () => {

        const user = { email: email, password: password }

        try {
            console.log(user)
            const response = await axios.post('http://localhost:4000/api/users/login', user);
            if (response.data && response.data.token) {
                // שמירת הטוקן ב-localStorage
                localStorage.setItem('token', response.data.token);
                // לאחר רישום מוצלח, נשלח את המידע ל-Redux (אם נדרש)
                console.log(response.data.token);
                dispatch(loginSuccess());
                navigae('../UserProfile')
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div>
            <h1>login</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                </div>
                <button type="button" onClick={login}>
                    login
                </button>
            </form>
        </div>
    );
};

export default Login;
