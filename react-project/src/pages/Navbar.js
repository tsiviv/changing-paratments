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
import { setuser } from '../features/Users';
import { setdesireApartment } from '../features/desirePartment';
import { setApartment } from '../features/partment';
import SendMessage from './ModalMessage';
import '../styles/navbar.css';

function NavbarHead() {
    const ModalShowDetails = useSelector((state) => state.user.ModalShowDetails); // השתמש ברידוסר הנכון
    const ModalShow = useSelector((state) => state.user.ModalShow); // השתמש ברידוסר הנכון
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // השתמש ברידוסר הנכון
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const token = localStorage.getItem('token');

    const addOrUpdate = () => {
        isAuthenticated ? dispatch(setModalShow()) : navigate('./Login');
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

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!parseJwt(token)) {
                logout_generall();
                return;
            }
            const id = parseJwt(token).id;
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                const userDetais = {
                    username: response.data.username,
                    email: response.data.email,
                    createdAt: response.data.updatedAt,
                };
                console.log(userDetais);
                dispatch(setuser(userDetais));
                dispatch(setdesireApartment(response.data.WantedApartments));
                dispatch(setApartment(response.data.Apartments));
            } catch (err) {
                if (err.response.status === 403) logout_generall();
                console.error('Error fetching user profile:', err);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [token, ModalShow, ModalShowDetails]);

    return (
        <>
            <Navbar className="custom-navbar shadow p-3  bg-body rounded" expand="lg" dir="rtl">
                <Navbar.Collapse className="w-100 head-nav">
                    <Form inline className="d-flex w-100">
                        <div className="d-flex " style={{ width: '65%', gap: '40px' }}>
                            <ul className="navbar-nav justify-content-start align-items-center">
                                <li className="nav-item">
                                    <Link
                                        to="/"
                                        className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
                                        aria-label="חזרה לעמוד הבית"
                                    >
                                        <i className="fas fa-home mb-2"></i> <span>עמוד הבית</span>
                                    </Link>
                                </li>
                            </ul>
                            <div className="text-start me-5">
                                <h1 className="display-4 fw-bold font-color-linear header">דירות להחלפה בימים הנוראים</h1>
                                <h4 className="text-muted font-color-linear header2">מאגר דירות להחלפה לימים הנוראים לכל המגזרים</h4>
                            </div>
                        </div>

                        <div className="d-flex justify-content-start" style={{ width: '35%', gap: '40px' }}>
                            <ul className="navbar-nav d-flex align-items-center" style={{ gap: '80px' }}>
                                {isAuthenticated ? (
                                    <>
                                        <li className="nav-item">
                                            <div
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={addOrUpdate}
                                                onKeyDown={(e) => e.key === 'Enter' && addOrUpdate()}
                                                role="button"
                                                tabIndex="0"
                                            >
                                                <i className="fas fa-plus mb-2"></i>
                                                <div style={{ textAlign: 'center', width: 'fit-content', minWidth: '90px', maxWidth: '250px', lineHeight: 1.4 }}>
                                                    <span style={{ fontWeight: 700, color: '#1d3557' }}>
                                                        הוספת דירה<br />או עדכון
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="nav-item ">
                                            <Link
                                                to="/UserProfile"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onKeyDown={(e) => e.key === 'Enter' && navigate('/UserProfile')}
                                            >
                                                <i className="fas fa-user"></i> אזור אישי
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={logout_generall}
                                                onKeyDown={(e) => e.key === 'Enter' && logout_generall()}
                                            >
                                                <i className="fas fa-sign-out-alt"></i> יציאה
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/"
                                                className="nav-link text-dark d-flex flex-column cursor-pointer1"
                                                onClick={() => setShow(true)}
                                                onKeyDown={(e) => e.key === 'Enter' && setShow(true)}
                                            >
                                                <i className="fas fa-comment-dots mb-1"></i>
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
                                                <i className="fas fa-plus mb-2"></i>
                                                <div style={{ textAlign: 'center', width: 'fit-content', minWidth: '90px', maxWidth: '250px', lineHeight: 1.4 }}>
                                                    <span style={{ fontWeight: 700, color: '#1d3557' }}>
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
                                                <i className="fas fa-sign-in-alt"></i> התחברות
                                            </Link>
                                        </li>
                                        <li className="nav-item ">
                                            <Link
                                                to="/Register"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onKeyDown={(e) => e.key === 'Enter' && navigate('/Register')}
                                            >
                                                <i className="fas fa-user-plus"></i> הרשמה
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                to="/"
                                                className="cursor-pointer1 nav-link text-dark d-flex flex-column"
                                                onClick={() => setShow(true)}
                                                onKeyDown={(e) => e.key === 'Enter' && setShow(true)}
                                            >
                                                <i className="fas fa-comment-dots mb-1"></i>
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
            <ApartmentForm show={ModalShow} onHide={() => dispatch(setModalShow())} />
            <SendMessage setShow={setShow} show={show}></SendMessage>
        </>
    );
}

export default NavbarHead;
