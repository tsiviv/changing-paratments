import React from 'react';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי

const CurrentpersonallDetails = () => {
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    console.log(user)
    return (
        <div>
            <h3>הדירה שאני מחפש</h3>
            <p><strong>כתובת רצויה:</strong> {user?.email}</p>
            <p><strong>מספר חדרים:</strong> {user?.username}</p>
        </div>
    );
};

export default CurrentpersonallDetails;
