import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const resetCode = params.get('code');  // קבלת הקוד מתוך ה-URL

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
    <div>
      <h2>שחזור סיסמה</h2>
      <form onSubmit={handleSubmit}>
        <label>סיסמה חדשה:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'מעדכן...' : 'שחזר סיסמה'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
