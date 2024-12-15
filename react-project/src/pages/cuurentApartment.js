import React from 'react';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import '../styles/ModalApartments.css'; // ייבוא קובץ ה-CSS

const CurrentApartment = () => {
    const Apartment = useSelector((state) => state.Apartment.Apartment)?.[0]; // השתמש ברידוסר הנכון
    console.log(Apartment);

    return (
        <div className="row mb-3 mt-3">
            <div className='email '>הדירה שברשותי</div>
            <div className="col-md-6">
                <div className="row">
                    <div className="d-flex flex-column">
                        <p><div>כתובת רצויה</div></p>
                        <p className="value"><span>{Apartment?.address}</span></p>
                        <p><div>מספר חדרים</div></p>
                        <p className="value"><span>{Apartment?.rooms}</span></p>
                        <p><div>קומה</div></p>
                        <p className="value"><span>{Apartment?.floor}</span></p>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="d-flex flex-column">
                        <p><div>עיר</div></p>
                        <p className="value"><span>{Apartment?.city}</span></p>
                        <p><div>מספר מיטות</div></p>
                        <p className="value"><span>{Apartment?.beds}</span></p>
                        <p><div>מספר מזרנים</div></p>
                        <p className="value"><span>{Apartment?.mattresses}</span></p>
                        <p><div>הערות</div></p>
                        <p ><span>{Apartment?.notes}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentApartment;
