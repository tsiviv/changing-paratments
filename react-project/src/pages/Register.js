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
    const validateName = (name) => name.length > 2;

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case "email": return validateEmail(value) ? "" : "אנא הכנס מייל תקין";
            case "name": return validateName(value) ? "" : "שם צריך להיות לפחות 3 אותיות";
            default: return "";
        }
    };

    useEffect(() => {
        setErrors({
            email: validateField("email", email),
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
            console.log(err)
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
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "60px",
                flexDirection: "column",
                minHeight: "90vh",
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1.5rem",
                color: "#231f20",
                overflow: "hidden"
            }}
        >
            <div className="login-page" style={{ maxWidth: "430px", width: "100%" }}>
                <form
                    className="login-form"
                    style={{
                        padding: "1.5em",
                        background: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                    }}
                >
                    <h1
                        style={{
                            textAlign: "center",
                            marginBottom: "1em",
                            color: "#231f20",
                            fontWeight: "500",
                            fontSize: "1.6rem"
                        }}
                    >
                        הרשמה
                    </h1>

                    <div style={{ position: "relative", marginBottom: "1.2em", textAlign: "right" }}>
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
                                color: "#231f20"
                            }}
                        />
                        {touched.name && errors.name && <p className="error-msg">{errors.name}</p>}
                    </div>

                    <div style={{ position: "relative", marginBottom: "1.2em", textAlign: "right" }}>
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
                                color: "#231f20"
                            }}
                        />
                        {touched.email && errors.email && <p className="error-msg">{errors.email}</p>}
                    </div>

                    <div style={{ marginBottom: "1.5em", textAlign: "right", position: "relative" }}>
                        <label
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "10px",
                                transform: "translateY(-50%)",
                                color: "#bf1b2c",
                                cursor: "pointer",
                                fontSize: "0.9rem"
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <i className="fas fa-lock"></i>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
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
                                color: "#231f20"
                            }}
                        />
                        {touched.password && errors.password && <p className="error-msg">{errors.password}</p>}
                    </div>

                    <div style={{ display: "flex", gap: "0.7rem", marginBottom: "1em" }}>
                        <button
                            type="button"
                            onClick={register}
                            disabled={!isFormValid}
                            style={{
                                flex: 1,
                                padding: "10px",
                                backgroundColor: "#bf1b2c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "1rem",
                                fontWeight: 600
                            }}
                        >
                            הרשמה
                        </button>
                    </div>

                    <GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                            useOneTap={false}
                            theme="outline"
                            style={{ transform: "scale(0.85)" }}
                        />
                    </GoogleOAuthProvider>

                    {message && (
                        <p
                            style={{
                                color: message.includes("לא") ? "#bf1b2c" : "#231f20",
                                textAlign: "center",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                marginTop: "0.8em"
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "1em",
                            fontSize: "0.95rem",
                            color: "#231f20"
                        }}
                    >
                        כבר יש לך חשבון?{" "}
                        <span
                            onClick={login}
                            style={{
                                color: "#bf1b2c",
                                cursor: "pointer",
                                textDecoration: "underline",
                                fontWeight: 600
                            }}
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
