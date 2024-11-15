import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { setuser, logout } from './features/Users';

const UserProfile = () => {
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const token = localStorage.getItem('token');
    console.log(token);
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    const dispatch = useDispatch();

    // פונקציה לפענוח טוקן JWT
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1]; // קח את החלק השני (Payload)
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }

    // קריאה לפונקציה ב-useEffect, כמו כן השתמש בפונקציה async בתוך useEffect
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}` // שלח את הטוקן בכותרת Authorization
                    }
                });
                dispatch(setuser(response.data));
            } catch (err) {
                console.error('Error fetching user profile:', err);
            }
        };

        if (token) {
            fetchUserProfile();
        }
    }, [token, dispatch]); // מוודאים שהפונקציה תרוץ רק כשיש שינוי ב-token

    const handleUpdate = async () => {
        const updatedUserData = {
            email: newEmail || user.email,
            name: newName || user.name
        };

        try {
            const response = await axios.put('http://localhost:4000/api/users/profile', updatedUserData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            dispatch(setuser(response.data)); // עדכון ה-state עם המידע החדש
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    return (
        <div>
            {user ? (
                <div>
                    <h1>Welcome, {user.username}</h1>
                    <p>Email: {user.email}</p>

                    {/* טופס לעדכון פרטי משתמש */}
                    <div>
                        <input
                            type="text"
                            placeholder="New Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="New Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <button onClick={handleUpdate}>Update Profile</button>
                    </div>

                    <button onClick={() => dispatch(logout())}>Logout</button>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
