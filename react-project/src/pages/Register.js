import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/Users";
import config from '../config';
import { useGoogleLogin } from '@react-oauth/google';

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
            const response = await axios.post(`${baseURL}users/register`, user);
            if (response?.status === 201) {
                navigate('../Login');
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setMessage("משתמש קיים");
            } else {
                setMessage("שגיאה בהרשמה");
            }
        }
    };

    const login = () => {
        navigate('../login');
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        try {
            const accessToken = tokenResponse.access_token;
            const serverResponse = await axios.post(`${baseURL}users/google-register`, { accessToken });
            if (serverResponse.data?.token) {
                localStorage.setItem("token", serverResponse.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setMessage("משתמש קיים");
                return;
            }
            setMessage("שגיאה של גוגל");
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setMessage("Google registration failed"),
        prompt: 'select_account', // מאלץ לבחור חשבון בכל פעם
    });

    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            minHeight: "90vh",
            background: "linear-gradient(135deg, #eaf4fc, #f5fcff)",
            fontFamily: "'Roboto', sans-serif",
            fontSize: "1rem",
            color: "#333",
            overflow: "hidden"
        }}>
            <div className="login-page" style={{ maxWidth: "500px", width: "100%" }}>
                <form className="login-form" style={{
                    padding: "3em",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}>
                    <h2 style={{ textAlign: "center", marginBottom: "1em", color: "#4A90E2" }}>הרשמה</h2>

                    {/* Name */}
                    <div style={{ position: "relative", marginBottom: "2em", textAlign: "right" }}>
                        <input
                            type="text"
                            placeholder="שם"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={() => handleBlur("name")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1.1rem",
                                textAlign: "right",
                            }}
                        />
                        {touched.name && errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div style={{ position: "relative", marginBottom: "2em", textAlign: "right" }}>
                        <input
                            type="email"
                            placeholder="מייל"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={() => handleBlur("email")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1.1rem",
                                textAlign: "right",
                            }}
                        />
                        {touched.email && errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div style={{ position: "relative", marginBottom: "2em", textAlign: "right" }}>
                        <label style={{
                            position: "absolute",
                            top: "50%",
                            left: "10px",
                            transform: "translateY(-50%)",
                            color: "#4A90E2"
                        }}>
                            <i className="fas fa-lock cursor-pointer1" onClick={() => setShowPassword(!showPassword)}></i>
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => handleBlur("password")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1.1rem",
                                textAlign: "right",
                            }}
                        />
                        {touched.password && errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={register}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: "#4A90E2",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "1.1rem",
                            marginBottom: "2em",
                        }}
                        disabled={!isFormValid}
                    >
                        הרשמה
                    </button>

                    {/* Google Button */}
                    <div onClick={() => googleLogin()} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "10px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        cursor: "pointer",
                        background: "#fff",
                        fontSize: "1rem",
                        fontWeight: "500"
                    }}>
                        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: "20px" }} />
                        <span>התחברות עם Google</span>
                    </div>

                    {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}

                    <p style={{ textAlign: "center", marginTop: "1.5em", fontSize: "0.9rem" }}>
                        כבר יש לך חשבון?{" "}
                        <span onClick={login} style={{ color: "#4A90E2", cursor: "pointer", textDecoration: "underline" }}>
                            התחבר
                        </span>
                    </p>
                </form>
            </div>
        </Box>
    );
}

export default Register;
