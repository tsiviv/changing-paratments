import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/Users";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ולידציה של שדות הטופס
    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const validatePassword = (password) => password.length >= 6;
    const validateName = (name) => name.length > 2;

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case "email":
                return validateEmail(value) ? "" : "אנא הכנס מייל תקין";
            case "password":
                return validatePassword(value) ? "" : "סיסמא חייבת להיות לפחות 6 תווים";
            case "name":
                return validateName(value) ? "" : "שם צריך להיות לפחות 3 אותיות";
            default:
                return "";
        }
    };

    useEffect(() => {
        // בדיקת ולידציה כשיש שינוי בערכים
        setErrors({
            email: validateField("email", email),
            password: validateField("password", password),
            name: validateField("name", name),
        });
    }, [email, password, name]);

    const isFormValid = !Object.values(errors).some((error) => error);

    const handleBlur = (fieldName) => {
        setTouched({ ...touched, [fieldName]: true });
    };

    const register = async () => {
        if (!isFormValid) return;

        const user = { username: name, email, password };
        try {
            const response = await axios.post('http://localhost:4000/api/users/register', user);
            if (response.data?.status==201) {
                navigate('../Login');
            }
        } catch (err) {
            if (err.response.status === 409) {
                setMessage("משתמש קיים");
            } else {
                console.error('Registration failed:', err);
                setMessage("שגיאה בהרשמה");
            }
        }
    };

    const login = () => {
        navigate('../login');
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const TokenId = response.credential;
            const serverResponse = await axios.post('http://localhost:4000/api/users/google-register', { TokenId });
            if (serverResponse.data?.token) {
                localStorage.setItem("token", serverResponse.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (err) {
            if (err.response.status === 409) {
                setMessage("משתמש קיים");
                return;
            }
            console.error('Google Login failed:', err);
            setMessage("שגיאה של גוגל");
        }
    };

    const handleGoogleFailure = (error) => {
        console.error("Google Login Error:", error);
        setMessage("Google registration failed");
    };

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                minHeight: "90vh",
                background: "linear-gradient(135deg, #eaf4fc, #f5fcff)",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1rem",
                color: "#333"
            }}
        >
            <div className="login-page" style={{ maxWidth: "400px", width: "100%" }}>
                <form
                    className="login-form"
                    style={{
                        padding: "2em",
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h2 style={{ textAlign: "center", marginBottom: "1em", color: "#4A90E2" }}>הרשמה</h2>
                    <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                        <input
                            type="text"
                            placeholder="שם"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => handleBlur("name")}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right",
                            }}
                        />
                        {touched.name && errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                    </div>

                    <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                        <input
                            type="email"
                            placeholder="מייל"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur("email")}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right",
                            }}
                        />
                        {touched.email && errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                    </div>

                    <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                        <input
                            type="password"
                            placeholder="סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur("password")}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right",
                            }}
                        />
                        {touched.password && errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                    </div>

                    <button
                        type="button"
                        onClick={register}
                        style={{
                            width: "100%",
                            padding: "10px",
                            background: "#4A90E2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1rem",
                            marginBottom: "1.5em",
                        }}
                        disabled={!isFormValid}
                    >
                        הרשמה
                    </button>

                    <GoogleOAuthProvider clientId='482512567613-7sb403cnibb5576hb4oidbhpouc6su9b.apps.googleusercontent.com'>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                            useOneTap
                            theme="outline"
                        />
                    </GoogleOAuthProvider>

                    {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}

                    <p style={{ textAlign: "center", marginTop: "1em", fontSize: "0.9rem" }}>
                        כבר יש לך חשבון?{" "}
                        <span
                            onClick={login}
                            style={{ color: "#4A90E2", cursor: "pointer", textDecoration: "underline" }}
                        >
                            התחבר
                        </span>
                    </p>
                </form>
            </div>
        </Box>
    );
}

export default Register;
