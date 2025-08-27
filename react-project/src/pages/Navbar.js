import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import '../styles/navbar.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { logout } from '../features/Users';
import { logout_desireApartment } from '../features/desirePartment';
import { logout_Apartment } from '../features/partment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setModalShow } from '../features/Users';
import ApartmentForm from './ApartmentForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa'; // ספריית אייקונים יפה
import { setuser } from '../features/Users';
import { setdesireApartment } from '../features/desirePartment';
import { setApartment } from '../features/partment';
import SendMessage from './ModalMessage';
import '../styles/navbar.css';
import config from '../config';

function NavbarHead() {
    const ModalShowDetails = useSelector((state) => state.user.ModalShowDetails); // השתמש ברידוסר הנכון
    const ModalShow = useSelector((state) => state.user.ModalShow); // השתמש ברידוסר הנכון
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // השתמש ברידוסר הנכון
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const token = localStorage.getItem('token');
    const baseURL = config.baseUrl
    // ...
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!parseJwt(token)) {
                logout_generall();
                return;
            }
            const id = parseJwt(token).id;
            try {
                const response = await axios.get(`${baseURL}users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data)
                const userDetais = {
                    username: response.data.username,
                    email: response.data.email,
                    createdAt: response.data.updatedAt,
                    notification: response.data.notification
                };
                dispatch(setuser(userDetais));
                dispatch(setdesireApartment(response.data.WantedApartments));
                dispatch(setApartment(response.data.Apartments));
                setNotificationsEnabled(response.data.notifaction);
            } catch (err) {
                if (err.response?.status === 403) logout_generall();
                console.error('Error fetching user profile:', err);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [token, ModalShow, ModalShowDetails]);

    // פונקציה להחלפת מצב התראות
    const toggleNotifications = async () => {
        try {
            const id = parseJwt(token).id
            const newStatus = !notificationsEnabled;
            await axios.post(
                `${baseURL}users/notification/${id}`,
                { enabled: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotificationsEnabled(newStatus);
        } catch (err) {
            console.error('Error updating notifications:', err);
        }
    };

    const addOrUpdate = () => {
        isAuthenticated ? dispatch(setModalShow(true)) : navigate('./Login');
    };

    const logout_generall = () => {
        dispatch(logout());
        dispatch(logout_Apartment());
        dispatch(logout_desireApartment());
    };

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

    return (
        <>
            <Navbar className="custom-navbar p-3 rounded "
                expand="lg" dir="rtl">
                <Navbar.Collapse className="w-100 head-nav">
                    <Form inline className="d-flex w-100">
                        <div className="d-flex " style={{ width: '58%', gap: '80px' }}>
                            <ul className="navbar-nav justify-content-start align-items-center">
                                <li className="nav-item">
                                    <Link
                                        to="/"
                                        className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
                                        aria-label="חזרה לעמוד הבית"
                                    >
                                        <i className="fas fa-home mb-2" style={{ color: '#bf1b2c' }}></i> <span>עמוד הבית</span>
                                    </Link>
                                </li>
                            </ul>
                            <div className="text-start me-5">
                                <img src="/logo.png" style={{ width: "450px", height: "100px" }}></img>
                                <div className='header-con'>
                                    <div className='head1'>מאגר דירות להחלפה</div>
                                    <div className='head2'>לימים הנוראים</div>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-start" style={{ width: '42%', gap: '30px' }}>
                            <ul className="navbar-nav d-flex align-items-center" style={{ gap: '90px' }}>
                                {isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <div
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={addOrUpdate}
                                                onKeyDown={(e) => e.key === 'Enter' && addOrUpdate()}
                                                role="button"
                                                tabIndex="0"
                                                // style={{ marginLeft: "-35px" }}
                                            >
                                                <i className="fas fa-plus" style={{ color: '#bf1b2c' }}></i>
                                                <div style={{ textAlign: 'center', width: 'fit-content', minWidth: '90px', maxWidth: '250px', lineHeight: 1.4 }}>
                                                    <span style={{ fontWeight: 700, color: '#231f20' }}>
                                                        הוספת דירה<br />או עדכון
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        {/* <li className="nav-item">
                                            <div
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={toggleNotifications}
                                                role="button"
                                                tabIndex="0"
                                                style={{ marginLeft: "-35px" }}
                                            >
                                                <FaBell size={20} style={{ color: notificationsEnabled ? 'gold' : 'black' }} />

                                                <div style={{ textAlign: 'center', width: 'fit-content', minWidth: '50px', maxWidth: '160px', lineHeight: 1.4 }}>
                                                    <span >
                                                        {notificationsEnabled ? '  להסרת קבלת התראות ' : 'קבלת התראות על דירות חדשות '}
                                                    </span>
                                                </div>
                                            </div>
                                        </li> */}

                                        <li className="nav-item ">
                                            <Link
                                                to="/UserProfile"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onKeyDown={(e) => e.key === 'Enter' && navigate('/UserProfile')}
                                            >
                                                <i className="fas fa-user" style={{ color: '#bf1b2c' }}></i> אזור אישי
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={logout_generall}
                                                onKeyDown={(e) => e.key === 'Enter' && logout_generall()}
                                            >
                                                <i className="fas fa-sign-out-alt" style={{ color: '#bf1b2c' }}></i> יציאה
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/"
                                                className="nav-link text-dark d-flex flex-column cursor-pointer1"
                                                onClick={() => setShow(true)}
                                                onKeyDown={(e) => e.key === 'Enter' && setShow(true)}
                                            >
                                                <i className="fas fa-comment-dots mb-1" style={{ color: '#bf1b2c' }}></i>
                                                <span>הודעה למערכת</span>
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <div
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={addOrUpdate}
                                                onKeyDown={(e) => e.key === 'Enter' && addOrUpdate()}
                                                role="button"
                                                tabIndex="0"
                                            >
                                                <i className="fas fa-plus" style={{ color: '#bf1b2c' }}></i>
                                                <div style={{ textAlign: 'center', width: 'fit-content', minWidth: '90px', maxWidth: '250px', lineHeight: 1.4 }}>
                                                    <span style={{ fontWeight: 700, color: '#231f20' }}>
                                                        הוספת דירה<br />או עדכון
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="nav-item ">
                                            <Link
                                                to="/Login"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onKeyDown={(e) => e.key === 'Enter' && navigate('/Login')}
                                            >
                                                <i className="fas fa-sign-in-alt" style={{ color: '#bf1b2c' }}></i> התחברות
                                            </Link>
                                        </li>
                                        <li className="nav-item ">
                                            <Link
                                                to="/Register"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onKeyDown={(e) => e.key === 'Enter' && navigate('/Register')}
                                            >
                                                <i className="fas fa-user-plus" style={{ color: '#bf1b2c' }}></i> הרשמה
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={() => setShow(true)}
                                                onKeyDown={(e) => e.key === 'Enter' && setShow(true)}
                                            >
                                                <i className="fas fa-comment-dots mb-1" style={{ color: '#bf1b2c' }}></i>
                                                <span>הודעה למערכת</span>
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
            <ApartmentForm show={ModalShow} onHide={() => dispatch(setModalShow(false))} />
            <SendMessage setShow={setShow} show={show}></SendMessage>
        </>
    );
}

export default NavbarHead;
