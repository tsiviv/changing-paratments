import React from 'react';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import '../styles/ModalApartments.css'; // ייבוא קובץ ה-CSS

const CurrentDesireApartment = () => {
    const desireApartment = useSelector((state) => state.desirePartment.desireApartment)?.[0]; // השתמש ברידוסר הנכון
console.log(desireApartment)
    return (
        <div className='container'>
            <h3>הדירה שאני מחפש</h3>
            <p><strong>כתובת רצויה:</strong> {desireApartment?.numberOfRooms}</p>
            <p><strong>כתובת רצויה:</strong> {desireApartment?.numberOfBeds}</p>
            <p><strong>כתובת רצויה:</strong> {desireApartment?.area}</p>
            <p><strong>מספר חדרים:</strong> {desireApartment?.preferredSwapDate}</p>
        </div>
    );
};


export default CurrentDesireApartment;
