import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        name: ''
    });
    const navigate = useNavigate();

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
    const validatePassword = (password) => password.length >= 6;
    const validateName = (name) => name.length > 2;

    const validateForm = () => {
        let formIsValid = true;
        let newErrors = { email: '', password: '', name: '' };

        if (!validateEmail(email)) {
            newErrors.email = 'Please include a valid email';
            formIsValid = false;
        }

        if (!validatePassword(password)) {
            newErrors.password = 'Password must be at least 6 characters';
            formIsValid = false;
        }

        if (!validateName(name)) {
            newErrors.name = 'Name must be at least 3 characters';
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    const register = async () => {
        if (!validateForm()) return;

        const user = { username: name, email, password };
        try {
            const response = await axios.post('http://localhost:4000/api/users/register', user);
            if (response.data) {
                navigate('../Login');
            }
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    const login = () => {
        navigate('../login');
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

                    {/* Name Field */}
                    <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                        <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#4A90E2" }}>
                            <i className="fas fa-user"></i>
                        </label>
                        <input
                            type="text"
                            placeholder="שם"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 10px 10px 40px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right", // Align text to the right for RTL
                            }}
                        />
                        {errors.name && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.name}</span>}
                    </div>

                    {/* Email Field */}
                    <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                        <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#4A90E2" }}>
                            <i className="fas fa-envelope"></i>
                        </label>
                        <input
                            type="email"
                            placeholder="מייל"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 10px 10px 40px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right", // Align text to the right for RTL
                            }}
                        />
                        {errors.email && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div style={{ position: "relative", marginBottom: "1.5em", textAlign: "right" }}>
                        <label style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#4A90E2" }}>
                            <i className="fas fa-lock"></i>
                        </label>
                        <input
                            type="password"
                            placeholder="סיסמא"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 10px 10px 40px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                                fontSize: "1rem",
                                textAlign: "right", // Align text to the right for RTL
                            }}
                        />
                        {errors.password && <span style={{ color: "red", fontSize: "0.8rem" }}>{errors.password}</span>}
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
                        }}
                    >
                        הרשמה
                    </button>

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
