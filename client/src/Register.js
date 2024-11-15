// src/Register.js

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { loginSuccess } from './features/Users';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    // סטייט לטופס
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const dispatch = useDispatch()
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const navigae = useNavigate()
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1]; // קח את החלק השני (Payload)
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
    const register = async () => {

        const user = { username: name, email: email, password: password }

        try {
            console.log(user)
            const response = await axios.post('http://localhost:4000/api/users/register', user);
            if (response.data) {
                // לאחר רישום מוצלח, נשלח את המידע ל-Redux
                navigae('../Login')
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />
                </div>
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
                <button type="button" onClick={register}>
                    Register
                </button>
                <div>{user?.email}</div>
            </form>
        </div>
    );
};

export default Register;
