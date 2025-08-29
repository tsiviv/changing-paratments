/* CurrentDesireApartment.jsx */
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/ModalApartments.css';

const CurrentDesireApartment = () => {
    const desireApartment = useSelector((state) => state.desirePartment.desireApartment)?.[0];

    return (
        <div className="row mb-3">
            <div className='email' style={{ fontSize: '18px', marginBottom: '6px' }}>הדירה שאני מחפש</div>
            <div className="col-md-6">
                <div className="d-flex flex-column">
                    <div style={{ marginBottom: '6px' }}>מספר חדרים רצוי</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{desireApartment?.numberOfRooms}</div>
                    <div style={{ marginBottom: '6px' }}>מספר מיטות רצוי</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{desireApartment?.numberOfBeds}</div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="d-flex flex-column">
                    <div style={{ marginBottom: '6px' }}>אזור רצוי</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{desireApartment?.area}</div>
                    <div style={{ marginBottom: '6px' }}>זמן החלפה רצוי</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{desireApartment?.preferredSwapDate}</div>
                </div>
            </div>
        </div>
    );
};

export default CurrentDesireApartment;
