import React from 'react';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import '../styles/ModalApartments.css'; // ייבוא קובץ ה-CSS

const CurrentApartment = () => {
    const Apartment = useSelector((state) => state.Apartment.Apartment)?.[0]; // השתמש ברידוסר הנכון
    console.log(Apartment);

    return (
        <div className="container">
            <h3>הדירה שאני מחפש</h3>
            <p><strong>כתובת רצויה:</strong> <span>{Apartment?.address}</span></p>
            <p><strong>מספר חדרים:</strong> <span>{Apartment?.rooms}</span></p>
            <p><strong>מספר מיטות:</strong> <span>{Apartment?.beds}</span></p>
            <p><strong>קומה:</strong> <span>{Apartment?.floor}</span></p>
            <p><strong>עיר:</strong> <span>{Apartment?.city}</span></p>
            <p><strong>מספר מזרנים:</strong> <span>{Apartment?.mattresses}</span></p>
            <p><strong>הערות:</strong> <span>{Apartment?.notes}</span></p>
        </div>
    );
};

export default CurrentApartment;
