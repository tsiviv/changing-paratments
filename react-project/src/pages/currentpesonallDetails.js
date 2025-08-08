import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import '../styles/ModalApartments.css'; // ייבוא קובץ ה-CSS
import PersonallDetails from './personalDetails';
import { useDispatch } from 'react-redux';
import {  setModalShowDetails } from '../features/Users';

const CurrentpersonallDetails = () => {
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    console.log(user)
    const ModalShowDetails = useSelector((state) => state.user.ModalShowDetails); // השתמש ברידוסר הנכון
    const dispatch=useDispatch()
    return (
        <div>
            <div className='d-flex flex-column ms-5'><div className='email'>מייל</div> <div className='email-value'>{user?.email}</div></div>
            <div className='link ' onClick={() => dispatch(setModalShowDetails())}>
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
