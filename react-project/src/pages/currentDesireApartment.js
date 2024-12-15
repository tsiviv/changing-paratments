import React from 'react';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import '../styles/ModalApartments.css'; // ייבוא קובץ ה-CSS

const CurrentDesireApartment = () => {
    const desireApartment = useSelector((state) => state.desirePartment.desireApartment)?.[0]; // השתמש ברידוסר הנכון
    console.log(desireApartment)
    return (
        <div className="row">
            <div className='email'>הדירה שאני מחפש</div>
            <div className="col-md-6">
                <div className="row">
                    <div className="d-flex flex-column">
                        <p><div>מספר חדרים רצוי</div></p>
                        <p className="value"><span>{desireApartment?.numberOfRooms}</span></p>
                        <p><div>מספר מיטות רצוי</div></p>
                        <p className="value"><span>{desireApartment?.numberOfBeds}</span></p>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="d-flex flex-column">
                    <p><div>אזור רצוי</div> </p>
                    <p className="value"><span>{desireApartment?.area}</span></p>
                    <p><div>זמן החלפה רצוי</div> </p>
                    <p className="value"><span>{desireApartment?.preferredSwapDate}</span></p>
                </div>
            </div>
        </div>
    );
};


export default CurrentDesireApartment;
