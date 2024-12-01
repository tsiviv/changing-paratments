import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../styles/navbar.css'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { logout } from '../features/Users';
import { logout_desireApartment } from '../features/desirePartment'
import { logout_Apartment } from '../features/partment'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setModalShow } from '../features/Users';
import MyVerticallyCenteredModal from './ModalApratment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setuser } from '../features/Users';
import { setdesireApartment } from '../features/desirePartment';
import { setApartment } from '../features/partment';
import SendMessage from './ModalMessage';
function NavbarHead() {
    const ModalShowDetails = useSelector((state) => state.user.ModalShowDetails); // השתמש ברידוסר הנכון
    const ModalShow = useSelector((state) => state.user.ModalShow); // השתמש ברידוסר הנכון
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // השתמש ברידוסר הנכון
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false)
    // API key שלך מ-OpenAI

    const addOrUpdate = () => {
        isAuthenticated ? dispatch(setModalShow()) : navigate('./Login')
    }
    const logout_generall = () => {
        dispatch(logout())
        dispatch(logout_Apartment())
        dispatch(logout_desireApartment())
    }
    const token = localStorage.getItem('token');

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1]; // קח את החלק השני (Payload)
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Invalid token:', error);
            return null;
        }
    }
    // קריאה לפונקציה ב-useEffect, כמו כן השתמש בפונקציה async בתוך useEffect
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!parseJwt(token)) {
                logout_generall()
                return
            }
            const id = parseJwt(token).id
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response.data)
                const userDetais = {
                    username: response.data.username,
                    email: response.data.email,
                    createdAt: response.data.updatedAt
                }
                console.log(userDetais)
                dispatch(setuser(userDetais));
                if (response.data.WantedApartments)
                    dispatch(setdesireApartment(response.data.WantedApartments));
                if (response.data.Apartments)
                    dispatch(setApartment(response.data.Apartments));

            } catch (err) {
                if (err.response.status = 403)
                    logout_generall()
                console.error('Error fetching user profile:', err);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [token, ModalShow, ModalShowDetails]); // מוודאים שהפונקציה תרוץ רק כשיש שינוי ב-token

    return (
        <>
            <Navbar className="btn-danger custom-navbar shadow " expand="lg" dir="rtl">
                <Navbar.Collapse className="btn-danger w-100 pe-5 ps-5">
                    <Form inline className="d-flex w-100">
                        {/* חלק ראשון של ה-Navbar, מקבל שני שלישים מהמקום */}
                        <div className="d-flex" style={{ flex: 2 }}>
                            <ul className='justify-content-center align-items-center '>
                                <li >
                                    <Link to="/">
                                        <i className="fas fa-home"></i> עמוד בית
                                    </Link>
                                </li>
                            </ul>
                            <div className='text-align-start'>
                                <h1 className='me-5'>דירות להחלפה בימים הנוראים</h1>
                                <h4>מאגר דירות להחלפה לימים הנוראים לכל המגזרים</h4>
                            </div>
                        </div>

                        {/* חלק שני של ה-Navbar, מקבל שליש מהמקום */}
                        <div className="d-flex justify-content-between" style={{ flex: 1 }}>
                            <Button className="btn-dark" size="lg" onClick={addOrUpdate}>הוספה או עדכון</Button>
                            <ul className='d-flex ul-padding justify-content-center align-items-center'>
                                {isAuthenticated ? (
                                    <>
                                        <li className='ms-5'>
                                            <Link to="/UserProfile">
                                                <i className="fas fa-user"></i> אזור אישי
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/"
                                                onClick={() => {
                                                    logout_generall();
                                                }}
                                            >
                                                <i className="fas fa-sign-out-alt"></i> יציאה
                                            </Link>
                                        </li>
                                        <li>
                                            <i class="fas fa-comment-dots" onClick={() => setShow(true)}></i>
                                        </li>

                                    </>
                                ) : (
                                    <>
                                        <li className='ms-5'>
                                            <Link to="/Login">
                                                <i className="fas fa-sign-in-alt"></i> התחברות
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/Register">
                                                <i className="fas fa-user-plus"></i> הרשמה
                                            </Link>
                                        </li>
                                        <li>
                                            <i class="fas fa-comment-dots" onClick={() => setShow(true)}></i>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <MyVerticallyCenteredModal
                show={ModalShow}
                onHide={() => dispatch(setModalShow())}
            />
            <SendMessage setShow={setShow} show={show}></SendMessage>
        </>

    );
}

export default NavbarHead;
