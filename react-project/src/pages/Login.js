import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess, setModalShow } from "../features/Users";
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'; // הייבוא החדש
import { jwtDecode } from 'jwt-decode';

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalloading(true);

        try {
            const response = await axios.post('http://localhost:4000/api/users/reset-password', {
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
        e.preventDefault();
        const user = { email, password };
        try {
            const response = await axios.post("http://localhost:4000/api/users/login", user);
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (error) {
            if (error.response.status = 404)
                setMessage("שם משתמש או סיסמא לא נכונים")
            console.error("Login failed:", error);
        }
    };

    const register = () => navigate("/register", { replace: false });

    // פונקציה לשחזור סיסמה
    const forgotPassword = async () => {
        // בדיקת תקינות המייל
        if (!emailRegex.test(email)) {
            setMessage("מייל לא תקין. נא להזין מייל תקני.");
            return;
        }
        setLoading(true);

        try {
            // שליחת בקשה לשחזור סיסמה
            const response = await axios.post("http://localhost:4000/api/users/forgot-password", { email }, { withCredentials: true });

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


            const response = await axios.post('http://localhost:4000/api/users/google-login', { TokenId });
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (error) {
            if (error.response.status = 4)
                setMessage("שם משתמש או סיסמא לא נכונים")
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
                        <h2 style={{ textAlign: "center", marginBottom: "1em", color: "#4A90E2" }}>התחברות</h2>

                        {/* Email Field */}
                        <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                            <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#4A90E2" }}>
                                <i className="fas fa-envelope"></i>
                            </label>
                            <input
                                type="email"
                                placeholder="מייל"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px 10px 10px 40px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1rem",
                                    textAlign: "right", // יישור הטקסט לימין
                                }}
                            />
                        </div>

                        {/* Password Field */}
                        <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                            <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#4A90E2" }}>
                                <i className="fas fa-lock"></i>
                            </label>
                            <input
                                type="password"
                                placeholder="סיסמה"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "10px 10px 10px 40px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1rem",
                                    textAlign: "right", // יישור הטקסט לימין
                                }}
                            />
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                            <button
                                disabled={loading}
                                type="button"
                                onClick={forgotPassword}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    backgroundColor: "#4A90E2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                }}
                            >
                                שכחתי סיסמה
                            </button>
                            <button
                                disabled={loading}
                                type="button"
                                onClick={checkuser}
                                style={{
                                    flex: 1,
                                    padding: "0.75rem",
                                    backgroundColor: "#4A90E2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1rem",
                                }}
                            >
                                התחבר
                            </button>
                        </div>
                        <GoogleOAuthProvider clientId='482512567613-7sb403cnibb5576hb4oidbhpouc6su9b.apps.googleusercontent.com'>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleFailure}
                                useOneTap
                                theme="outline"
                            />
                        </GoogleOAuthProvider>
                        {/* Register Link */}
                        <p style={{ textAlign: "center", marginTop: "1em", fontSize: "0.9rem" }}>
                            עדיין לא רשום?{" "}
                            <span
                                onClick={register}
                                style={{ color: "#4A90E2", cursor: "pointer", textDecoration: "underline" }}
                            >
                                הרשמה
                            </span>
                        </p>

                        {loading && <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>}

                        {/* Message */}
                        {message && (
                            <p style={{ color: message.includes("לא") ? "red" : "green", textAlign: "center" }}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </Box>
            {/* Reset Password Modal */}
            <Modal show={showModal} onHide={closemodal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>שחזור סיסמה</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <input
                            type="number"
                            placeholder="הכנס קוד שחזור"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            style={{
                                width: "100%",
                                marginBottom: "1rem",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right",
                            }}
                        />
                        <input
                            type="password"
                            placeholder="סיסמה חדשה"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right",
                            }}
                        />

                        {Modalloading && <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>}
                        {Modalmessage && <p style={{ color: Modalmessage.includes("לא") ? "red" : "green", textAlign: "center" }}>
                            {Modalmessage}
                        </p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closemodal}>
                        ביטול
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        עדכן סיסמה
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Login;
