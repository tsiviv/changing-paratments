/* CurrentApartment.jsx */
import React from 'react';
import { useSelector } from 'react-redux';
import '../styles/ModalApartments.css';

const CurrentApartment = () => {
    const Apartment = useSelector((state) => state.Apartment.Apartment)?.[0];

    return (
        <div className="row mb-3">
            <div className='email' style={{ fontSize: '18px', marginBottom: '6px' }}>הדירה שברשותי</div>
            <div className="col-md-6">
                <div className="d-flex flex-column">
                    <div style={{ marginBottom: '6px' }}>כתובת רצויה</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.address}</div>
                    <div style={{ marginBottom: '6px' }}>מספר חדרים</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.rooms}</div>
                    <div style={{ marginBottom: '6px' }}>קומה</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.floor}</div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="d-flex flex-column">
                    <div style={{ marginBottom: '6px' }}>עיר</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.city}</div>
                    <div style={{ marginBottom: '6px' }}>מספר מיטות</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.beds}</div>
                    <div style={{ marginBottom: '6px' }}>מספר מזרנים</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.mattresses}</div>
                    <div style={{ marginBottom: '6px' }}>הערות</div>
                    <div className="value" style={{ fontSize: '15px', marginBottom: '8px' }}>{Apartment?.notes}</div>
                </div>
            </div>
        </div>
    );
};

export default CurrentApartment;
