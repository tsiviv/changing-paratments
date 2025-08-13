import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import config from '../config';
import Box from "@mui/material/Box";

const ResetPassword = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const resetCode = params.get('code');  // קבלת הקוד מתוך ה-URL
  const baseURL = config.baseUrl;

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}users/reset-password`, {
        code: resetCode,
        newPassword,
      });
      setMessage(response.data.message);
    } catch (error) {
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
        background: "linear-gradient(135deg, #eaf4fc, #f5fcff)",
        fontFamily: "'Roboto', sans-serif",
        overflow: "hidden",
      }}
    >
      <div style={{
        width: "420px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        padding: "3em",
        textAlign: "right" // טקסט מימין לשמאל
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5em", color: "#4A90E2" }}>שחזור סיסמה</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", marginBottom: "0.5em", fontWeight: 600 }}>סיסמה חדשה</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "15px",
              marginBottom: "1.5em",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "1.1rem",
              textAlign: "right",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              backgroundColor: "#4A90E2",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "1.1rem",
              cursor: "pointer"
            }}
          >
            {loading ? "מעדכן..." : "שחזר סיסמה"}
          </button>
        </form>
        {message && (
          <p style={{ textAlign: "center", marginTop: "1em", color: message.includes("לא") ? "red" : "green" }}>
            {message}
          </p>
        )}
      </div>
    </Box>
  );
};

export default ResetPassword;
