import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import Button from 'react-bootstrap/Button';
import PersonallDetails from './personalDetails';
import CurrentApartment from './cuurentApartment';
import CurrentDesireApartment from './currentDesireApartment';
import CurrentpersonallDetails from './currentpesonallDetails';
import { setModalShow, setModalShowDetails } from '../features/Users';

const UserProfile = () => {
    const ModalShowDetails = useSelector((state) => state.user.ModalShowDetails); // השתמש ברידוסר הנכון
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // השתמש ברידוסר הנכון
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון

    const dispatch = useDispatch();

    // פונקציה לפענוח טוקן JWT
    return (
        <div>
            {isAuthenticated ?
                (
                    <div>
                        <h3>hello {user.username}</h3>
                        <CurrentApartment />
                        <CurrentDesireApartment />
                        <CurrentpersonallDetails />
                        <div className="text-center mt-5">
                            <Button variant="primary" onClick={() => dispatch(setModalShowDetails())}>
                                עדכן פרטים אישיים
                            </Button>
                        </div>
                        <PersonallDetails
                            show={ModalShowDetails}
                            onHide={() => dispatch(setModalShowDetails())}
                        />
                    </div>

                ) : <></>}
        </div>
    );
};

export default UserProfile;
