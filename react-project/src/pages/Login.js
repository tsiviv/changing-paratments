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
    const checkuser = async (e) => {
        const user = { email, password };
        try {
            const response = await axios.post(`${baseURL}users/login`, user);
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (error) {
            if (error.response.status == 401) {
                setMessage("שם משתמש או סיסמא לא נכונים")
            }
            console.error("Login failed:", error);
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
    const handleGoogleSuccess = async (response) => {
        const TokenId = response.credential
        console.log(response);
        try {


            const response = await axios.post(`${baseURL}users/google-login`, { TokenId });
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (error) {
            if (error.response.status == 404)
                setMessage("משתמש לא קיים, הרשם קודם")
            console.error("Login failed:", error);
        }
    };

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
                    justifyContent: "center",
                    flexDirection: "column",
                    minHeight: "90vh",
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "1.25rem",
                    color: "#231f20",
                    overflow: "hidden"
                }}
            >
                <div className="login-page" style={{ maxWidth: "500px", width: "100%" }}>
                    <form
                        className="login-form"
                        style={{
                            padding: "3em",
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h1 style={{ textAlign: "center", marginBottom: "1em", color: "#231f20", fontWeight: "500" }}>התחברות</h1>

                        {/* שדה המייל */}
                        <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                            <input
                                type="email"
                                placeholder="מייל"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "15px 15px 15px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1.25rem",
                                    textAlign: "right",
                                    color: "#231f20"
                                }}
                            />
                        </div>


                        <div style={{ marginBottom: "2em", textAlign: "right", position: "relative" }}>
                            <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#bf1b2c", cursor: "pointer" }}
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
                                    padding: "12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1.1rem",
                                    textAlign: "right",
                                    color: "#231f20"
                                }}
                            />
                        </div>


                        {/* כפתורים */}
                        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                            {/* <button
                                disabled={loading}
                                type="button"
                                onClick={forgotPassword}
                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    backgroundColor: "#bf1b2c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1.25rem",
                                    fontWeight: 700
                                }}
                            >
                                שכחתי סיסמה
                            </button> */}
                            <button
                                disabled={loading}
                                type="button"
                                onClick={checkuser}
                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    backgroundColor: "#bf1b2c",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1.25rem",
                                    fontWeight: 700
                                }}
                            >
                                התחבר
                            </button>
                        </div>
                        <GoogleOAuthProvider clientId="482512567613-7sb403cnibb5576hb4oidbhpouc6su9b.apps.googleusercontent.com">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                theme="outline"
                                useOneTap={false} // מבטל התחברות אוטומטית
                                promptMomentNotification={() => { }} // אופציונלי - מונע הצעות אוטומטיות
                            />
                        </GoogleOAuthProvider>
                        <p style={{ textAlign: "center", marginTop: "1.5em", fontSize: "1rem", color: "#231f20" }}>
                            עדיין לא רשום?{" "}
                            <span
                                onClick={register}
                                style={{ color: "#bf1b2c", cursor: "pointer", textDecoration: "underline", fontWeight: 700 }}
                            >
                                הרשמה
                            </span>
                        </p>

                        {/* הודעות */}
                        {message && (
                            <p style={{ color: message.includes("לא") ? "#bf1b2c" : "#231f20", textAlign: "center", fontWeight: 700 }}>
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
