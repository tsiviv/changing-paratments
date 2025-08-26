import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import config from '../config';
import '../styles/login.css';

const ResetPassword = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const resetCode = params.get('code');
  const baseURL = config.baseUrl;
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}users/reset-password`, {
        code: resetCode,
        newPassword,
      });
      setMessage(response.data.message);
      await sleep(2000);
      navigate('../login');
    } catch (error) {
      console.log(error)
      setMessage(error.response?.data?.message || 'אירעה שגיאה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        minHeight: "90vh",
        fontFamily: "'Roboto', sans-serif",
        overflow: "hidden",
      }}
    >
      <div className="form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>שחזור סיסמה</h2>

          <input
            type="password"
            placeholder="סיסמה חדשה"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "מעדכן..." : "שחזר סיסמה"}
          </button>

          {message && (
            <p className={`message ${message.includes("לא") ? "error" : "success"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </Box>
  );
};

export default ResetPassword;
