import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/Users";
import config from '../config';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import '../styles/login.css'

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const baseURL = config.baseUrl;

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const validatePassword = (password) => password.length >= 6;
    const validateName = (name) => name.length > 2;

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case "email": return validateEmail(value) ? "" : "אנא הכנס מייל תקין";
            case "password": return validatePassword(value) ? "" : "סיסמא חייבת להיות לפחות 6 תווים";
            case "name": return validateName(value) ? "" : "שם צריך להיות לפחות 3 אותיות";
            default: return "";
        }
    };

    useEffect(() => {
        setErrors({
            email: validateField("email", email),
            password: validateField("password", password),
            name: validateField("name", name),
        });
    }, [email, password, name]);

    const isFormValid = !Object.values(errors).some(Boolean);

    const handleBlur = (fieldName) => setTouched({ ...touched, [fieldName]: true });

    const register = async () => {
        if (!isFormValid) return;
        const user = { username: name, email, password };
        try {
            const response = await axios.post(`${baseURL}users/register`, user);
            if (response?.status === 201) navigate('../Login');
        } catch (err) {
            if (err.response?.status === 409) setMessage("משתמש קיים");
            else setMessage("שגיאה בהרשמה");
        }
    };

    const login = () => navigate('../login');

    const handleGoogleSuccess = async (response) => {
        try {
            const TokenId = response.credential;
            const serverResponse = await axios.post(`${baseURL}users/google-register`, { TokenId });
            if (serverResponse.data?.token) {
                localStorage.setItem("token", serverResponse.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (err) {
            if (err.response?.status === 409) setMessage("משתמש קיים");
            else setMessage("שגיאה של גוגל");
        }
    };

    const handleGoogleFailure = (error) => {
        console.error("Google Login Error:", error);
        setMessage("Google registration failed");
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", minHeight: "90vh", fontFamily: "'Roboto', sans-serif", fontSize: "1rem", color: "#231f20", overflow: "hidden" }}>
            <div className="login-page">
                <form className="login-form">
                    <h1>הרשמה</h1>

                    <div style={{ marginBottom: "1.5em", textAlign: "right", position: "relative" }}>
                        <input type="text" placeholder="שם" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => handleBlur("name")} />
                        {touched.name && errors.name && <p className="error-msg">{errors.name}</p>}
                    </div>

                    <div style={{ marginBottom: "1.5em", textAlign: "right" }}>
                        <input type="email" placeholder="מייל" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur("email")} />
                        {touched.email && errors.email && <p className="error-msg">{errors.email}</p>}
                    </div>

                    <div style={{ marginBottom: "2em", textAlign: "right", position: "relative" }}>
                        <label className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            <i className="fas fa-lock"></i>
                        </label>
                        <input type={showPassword ? "text" : "password"} placeholder="סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur("password")} />
                        {touched.password && errors.password && <p className="error-msg">{errors.password}</p>}
                    </div>

                    <button type="button" onClick={register} disabled={!isFormValid} className="register-btn">הרשמה</button>

                    <GoogleOAuthProvider clientId='482512567613-7sb403cnibb5576hb4oidbhpouc6su9b.apps.googleusercontent.com'>
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} useOneTap={false} promptMomentNotification={() => {}} theme="outline" />
                    </GoogleOAuthProvider>

                    {message && <p className="error-msg" style={{ textAlign: "center", marginTop: "1em" }}>{message}</p>}

                    <p className="login-link">
                        כבר יש לך חשבון?{" "}
                        <span onClick={login}>התחבר</span>
                    </p>
                </form>
            </div>
        </Box>
    );
}

export default Register;
