/* CurrentpersonallDetails.jsx */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/ModalApartments.css';
import PersonallDetails from './personalDetails';
import { setModalShowDetails } from '../features/Users';

const CurrentpersonallDetails = () => {
    const user = useSelector((state) => state.user.user);
    const ModalShowDetails = useSelector((state) => state.user.ModalShowDetails);
    const dispatch = useDispatch();

    return (
        <div style={{ fontSize: '15px', marginBottom: '12px' }}>
            <div className='d-flex flex-column ms-3'>
                <div className='email' style={{ fontSize: '18px', marginBottom: '6px' }}>מייל</div>
                <div className='email-value' style={{ fontSize: '15px', marginBottom: '8px' }}>{user?.email}</div>
            </div>
            <div className='link' style={{ fontSize: '15px', marginBottom: '8px' }} onClick={() => dispatch(setModalShowDetails())}>
                עדכן פרטים אישיים
            </div>
            <PersonallDetails
                show={ModalShowDetails}
                onHide={() => dispatch(setModalShowDetails())}
            />
        </div>
    );
};

export default CurrentpersonallDetails;
