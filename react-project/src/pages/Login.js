import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess, setModalShow } from "../features/Users";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // הייבוא החדש
import config from "../config";
import '../styles/login.css'

function Login() {
    const [loading, setLoading] = useState(false);
    const [Modalloading, setModalloading] = useState(false);
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [Modalmessage, setModalmessage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showModal, setShowModal] = useState(false); // שליטה במודל
    const [resetCode, setResetCode] = useState("")
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [showPassword, setShowPassword] = useState(false);
    const baseURL = config.baseUrl

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalloading(true);

        try {
            const response = await axios.post(`${baseURL}users/reset-password`, {
                code: resetCode,
                newPassword,
            }, { withCredentials: true });
            setModalmessage(response.data.message);
        } catch (error) {
            setModalmessage(error.response?.data?.message || 'אירעה שגיאה');
        }
        finally {
            setModalloading(false);
        }
    };
    // פונקציה לטיפול בהתחברות רגילה
    const handleLoginResponse = (response) => {
        // טיפול אחיד בתגובות
        if (response.status === 200) {
            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(loginSuccess());
                navigate("../");
            } else {
                setMessage(response.data?.message || "התחברות הצליחה אך לא התקבל Token");
            }
        } else {
            setMessage(response.data?.message || "אירעה שגיאה");
        }
    };

    const handleGoogleSuccess = async (response) => {
        const TokenId = response.credential;
        try {
            const res = await axios.post(`${baseURL}users/google-login`, { TokenId });
            handleLoginResponse(res);
        } catch (error) {
            const status = error.response?.status;
            if (status === 404) setMessage("משתמש לא קיים, הרשם קודם");
            else if (status === 409) setMessage("המשתמש כבר קיים");
            else if (status === 401) setMessage("סיסמה לא נכונה");
            else setMessage(error.response?.data?.message || "אירעה שגיאה בכניסה עם Google");
        } finally {
            setShowModal(true);
        }
    };

    const checkuser = async () => {
        const user = { email, password };
        try {
            const res = await axios.post(`${baseURL}users/login`, user);
            handleLoginResponse(res);
        } catch (error) {
            const status = error.response?.status;
            if (status === 404) setMessage("משתמש לא קיים, הרשם קודם");
            else if (status === 401) setMessage("שם משתמש או סיסמה לא נכונים");
            else setMessage(error.response?.data?.message || "אירעה שגיאה בכניסה");
        } finally {
            setShowModal(true);
        }
    };

    const register = () => navigate("/register", { replace: false });

    const forgotPassword = async () => {
        console.log("forget")
        if (!emailRegex.test(email)) {
            setMessage("מייל לא תקין. נא להזין מייל תקני.");
            return;
        }
        setLoading(true);

        try {
            const response = await axios.post(`${baseURL}users/forgot-password`, { email }, { withCredentials: true });

            if (response.data) {
                setMessage("קוד שיחזור נשלח למייל שלך!");
            } else {
                setMessage("לא הצלחנו למצוא משתמש עם מייל זה.");
            }
        } catch (error) {
            console.error("Error during password recovery request:", error);
            setMessage("אירעה שגיאה , נסה שוב מאוחר יותר.");
        }
        finally {

            setLoading(false)
            setShowModal(true)
        }
    };
    const closemodal = () => {
        setShowModal(false)
        setMessage("")
    }

    const handleGoogleFailure = (error) => {
        console.error("Google Login Error:", error);
        setMessage("Google registration failed");
    };
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "80px",
                    flexDirection: "column",
                    minHeight: "90vh",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "1.5rem",
                    color: "#231f20",
                    overflow: "hidden"
                }}
            >
                <div className="login-page" style={{ maxWidth: "430px", width: "100%" }}> {/* רחב יותר */}
                    <form
                        className="login-form"
                        style={{
                            padding: "1.5em", // פדינג מוקטן
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        }}
                    >
                        <h1
                            style={{
                                textAlign: "center",
                                marginBottom: "1em",
                                color: "#231f20",
                                letterSpacing: "1px",
                                fontWeight: "500",
                                fontSize: "1.6rem", // קטן יותר
                            }}
                        >
                            התחברות
                        </h1>

                        {/* שדה המייל */}
                        <div style={{ position: "relative", marginBottom: "1.2em", textAlign: "right" }}>
                            <input
                                type="email"
                                placeholder="מייל"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px", // מוקטן
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1rem", // מוקטן
                                    textAlign: "right",
                                    color: "#231f20",
                                }}
                            />
                        </div>

                        {/* שדה סיסמה */}
                        <div style={{ marginBottom: "1.5em", textAlign: "right", position: "relative" }}>
                            <label
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "10px",
                                    transform: "translateY(-50%)",
                                    color: "#bf1b2c",
                                    cursor: "pointer",
                                    fontSize: "0.9rem",
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className="fas fa-lock"></i>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="סיסמה"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1rem",
                                    textAlign: "right",
                                    color: "#231f20",
                                }}
                            />
                        </div>

                        {/* כפתור התחברות */}
                        <div style={{ display: "flex", gap: "0.7rem", marginBottom: "1em" }}>
                            <button
                                disabled={loading}
                                type="button"
                                onClick={checkuser}
                                style={{
                                    flex: 1,
                                    padding: "10px",
                                    backgroundColor: "#bf1b2c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                }}
                            >
                                התחבר
                            </button>
                        </div>

                        {/* Google Login */}
                        <GoogleOAuthProvider clientId="482512567613-7sb403cnibb5576hb4oidbhpouc6su9b.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                theme="outline"
                                useOneTap={false} // מבטל התחברות אוטומטית
                                promptMomentNotification={() => { }} // אופציונלי - מונע הצעות אוטומטיות
                            />
                        </GoogleOAuthProvider>

                        {/* קישור הרשמה */}
                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "1em",
                                fontSize: "0.95rem",
                                color: "#231f20",
                            }}
                        >
                            עדיין לא רשום?{" "}
                            <span
                                onClick={register}
                                style={{
                                    color: "#bf1b2c",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    fontWeight: 600,
                                }}
                            >
                                הרשמה
                            </span>
                        </p>

                        {/* הודעות */}
                        {message && (
                            <p
                                style={{
                                    color: message.includes("לא") ? "#bf1b2c" : "#231f20",
                                    textAlign: "center",
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    marginTop: "0.8em",
                                }}
                            >
                                {message}
                            </p>
                        )}
                    </form>

                </div>
            </Box>



        </>
    );
}

export default Login;
