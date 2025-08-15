import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess, setModalShow } from "../features/Users";
import config from "../config";
import { useGoogleLogin } from '@react-oauth/google';

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
    const [showPassword, setShowPassword] = useState(true);
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
        e.preventDefault();
        const user = { email, password };
        try {
            const response = await axios.post(`${baseURL}users/login`, user);
            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(loginSuccess());
                navigate("../");
            }
        } catch (error) {
            if (error.response.status == 404) {
                setMessage("שם משתמש או סיסמא לא נכונים")
            }
            console.error("Login failed:", error);
        }
    };

    const register = () => navigate("/register", { replace: false });

    const forgotPassword = async () => {
        if (!emailRegex.test(email)) {
            setMessage("מייל לא תקין. נא להזין מייל תקני.");
            return;
        }
        setLoading(true);

        try {
            // שליחת בקשה לשחזור סיסמה
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

    const handleGoogleSuccess = async (googleData) => {
    try {
        const TokenId = googleData.access_token; // לוודא שזו באמת ה־ID Token
        const res = await axios.post(`${baseURL}users/google-login`, { TokenId });

        if (res.data?.token) {
            localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess());
            navigate("../");
        }
    } catch (error) {
        if (error.response?.status === 404) {
            setMessage("משתמש לא קיים, הרשם קודם");
        }
        console.error("Login failed:", error);
    }
};

    const handleGoogleFailure = (error) => {
        console.error("Google Login Error:", error);
        setMessage("Google registration failed");
    };
    const googleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: handleGoogleFailure,
        prompt: 'select_account',
    });

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
                    fontSize: "1.25rem", // הגדל את גודל הגופן
                    color: "#333",
                    overflow: "hidden"
                }}
            >
                <div className="login-page" style={{ maxWidth: "500px", width: "100%" }}> {/* הגדל את הרוחב המקסימלי */}
                    <form
                        className="login-form"
                        style={{
                            padding: "3em", // הגדל את המרווח הפנימי
                            background: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)", // הגדל את הצל
                        }}
                    >
                        <h2 style={{ textAlign: "center", marginBottom: "1.5em", color: "#4A90E2" }}>התחברות</h2> {/* הגדל את הרווחים סביב הכותרת */}

                        {/* שדה המייל */}
                        <div style={{ position: "relative", marginBottom: "2em", textAlign: "right" }}>
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
                                    padding: "15px 15px 15px 50px", // הגדל את הגובה והמילוי
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1.25rem", // הגדל את גודל הגופן
                                    textAlign: "right",
                                }}
                            />
                        </div>

                        {/* שדה הסיסמה */}
                        <div style={{ position: "relative", marginBottom: "2em", textAlign: "right" }}>
                            <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#4A90E2" }}>
                                <i className="fas fa-lock cursor-pointer1" onClick={() => setShowPassword(!showPassword)}></i>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="סיסמה"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "15px 15px 15px 50px", // הגדל את הגובה והמילוי
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "1.25rem", // הגדל את גודל הגופן
                                    textAlign: "right",
                                }}
                            />
                        </div>

                        {/* כפתורים */}
                        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}> {/* הגדל את המרווח בין הכפתורים */}
                            <button
                                disabled={loading}
                                type="button"
                                onClick={forgotPassword}
                                style={{
                                    flex: 1,
                                    padding: "1rem",
                                    backgroundColor: "#4A90E2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1.25rem", // הגדל את גודל הגופן
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
                                    padding: "1rem",
                                    backgroundColor: "#4A90E2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "1.25rem", // הגדל את גודל הגופן
                                }}
                            >
                                התחבר
                            </button>
                        </div>

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


                        {/* לינק להרשמה */}
                        <p style={{ textAlign: "center", marginTop: "1.5em", fontSize: "1rem" }}>
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

                        {/* הודעה */}
                        {message && (
                            <p style={{ color: message.includes("לא") ? "red" : "green", textAlign: "center" }}>
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
