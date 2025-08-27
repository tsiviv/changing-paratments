import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { setModalShow, logout } from '../features/Users';
import { useDispatch } from 'react-redux';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import AlertComponent from './Alert';

const ApartmentForm = (props) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const desireApartment = useSelector((state) => state.desirePartment.desireApartment)?.[0]; // השתמש ברידוסר הנכון
    const Apartment = useSelector((state) => state.Apartment.Apartment)?.[0]; // השתמש ברידוסר הנכון
    const dispatch = useDispatch()
    const [isFormValid, setIsFormValid] = useState(true); // מצב תקינות הטופס
    const [cityError, setCityError] = useState("");
    const [showAlert, setShowAlert] = useState(false)
    const [message, setMessage] = useState("")
    const [formDataCurrent, setFormDataCurrent] = useState({
        address: Apartment?.address || '',
        rooms: Apartment?.rooms || '',
        beds: Apartment?.beds || '',
        floor: Apartment?.floor || '',
        city: Apartment?.city || '',
        mattresses: Apartment?.mattresses || '',
        notes: Apartment?.notes || '',
        preferredSwapDate: Apartment?.preferredSwapDate,
        userId: parseJwt(token)?.id
    });
    const baseURL = config.baseUrl


    const [formDataDesired, setFormDataDesired] = useState({
        numberOfRooms: desireApartment?.numberOfRooms,
        numberOfBeds: desireApartment?.numberOfBeds,
        area: desireApartment?.area,
        userId: parseJwt(token)?.id
    });
    useEffect(() => {
        if (Apartment) {
            setFormDataCurrent({
                address: Apartment.address,
                rooms: Apartment.rooms,
                beds: Apartment.beds,
                floor: Apartment.floor,
                city: Apartment.city,
                mattresses: Apartment.mattresses,
                notes: Apartment.notes,
                preferredSwapDate: Apartment?.preferredSwapDate,
            });
            setFormDataDesired({
                numberOfRooms: desireApartment?.numberOfRooms,
                numberOfBeds: desireApartment?.numberOfBeds,
                area: desireApartment?.area,
                userId: parseJwt(token)?.id
            })
        }
    }, [Apartment, desireApartment]);

    useEffect(() => {

        console.log("useefe", Apartment)
        const token = localStorage.getItem('token');
        if (!token) {
            return
        }
        setFormDataCurrent({
            address: Apartment?.address,
            rooms: Apartment?.rooms,
            beds: Apartment?.beds,
            floor: Apartment?.floor,
            city: Apartment?.city,
            mattresses: Apartment?.mattresses,
            notes: Apartment?.notes,
            userId: parseJwt(token)?.id,
            preferredSwapDate: Apartment?.preferredSwapDate,
        })
        setFormDataDesired({
            numberOfRooms: desireApartment?.numberOfRooms,
            numberOfBeds: desireApartment?.numberOfBeds,
            area: desireApartment?.area,
            userId: parseJwt(token)?.id
        })
    }, [navigate, token]);
    const isAnyFieldFilled = () => {
        return (
            formDataDesired.area ||
            formDataDesired.numberOfRooms ||
            formDataDesired.numberOfBeds);
    };
    function parseJwt(token) {
        if (!token) {
            logout()
            // navigate('../login')
            return
        }
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
    function validateCity(input) {
        const inputTrimmed = input.trim()
        return config.cities.some(city => city === inputTrimmed);
    }


    const deleteDesirApatment = async () => {
        try {
            const responseCurrent = await axios.delete(`${baseURL}alternativePartmnetsRoutes/${desireApartment.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setMessage('הפרטים התעדכנו בהצלחה!');
                setShowAlert(true)
                setFormDataDesired({
                    numberOfRooms: "",
                    numberOfBeds: "",
                    area: "",
                    userId: ""
                });
                setTimeout(() => {
                    dispatch(setModalShow());
                }, 1200);
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)

            }
        } catch (error) {
            if (error.response)
                if (error.response.status = 403) {
                    setMessage("התחבר שוב לחשבונך")
                    setShowAlert(true)
                    return
                }
            console.error('Error:', error);
        }
    }
    const deletecurrentApartment = async () => {
        try {
            const responseCurrent = await axios.delete(`${baseURL}OnwerParmters/${Apartment.id}`, formDataCurrent, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setMessage('הפרטים התעדכנו בהצלחה!');
                setShowAlert(true)
                setFormDataCurrent({
                    address: "",
                    rooms: "",
                    beds: "",
                    floor: "",
                    preferredSwapDate: "",
                    city: "",
                    mattresses: "",
                    notes: "",
                    userId: parseJwt(token)?.id
                });
                setTimeout(() => {
                    dispatch(setModalShow());
                }, 1200);
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
            if (error.response)
                if (error.response.status = 403) {
                    setMessage("התחבר שוב לחשבונך")
                    setShowAlert(true)
                    return
                }
            console.error('Error:', error);
        }
    }
    const handleChangeCurrent = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "S")
        if (name === "city") {
            setFormDataCurrent({ ...formDataCurrent, [name]: value });

            // בדיקה אם העיר תקינה
            if (value && !validateCity(value)) {
                setCityError("העיר שהזנת אינה מוכרת במאגר. אנא בחר עיר תקינה.");
                setIsFormValid(false);
            } else {
                setCityError("");
                setIsFormValid(true); // עדכון שהטופס תקין
            }
        } else {

            setFormDataCurrent((prevState) => ({
                ...prevState,
                [name]: name === "preferredSwapDate" ? Number(value) : value
            }));
        }
    };
    const handleChangeDesired = (e) => {
        const { name, value } = e.target;

        setFormDataDesired((prevState) => ({
            ...prevState,
            [name]: name === "preferredSwapDate" ? Number(value) : value
        }));
    };


    const updateDesirePartemnt = async () => {
        try {
            const responseCurrent = await axios.put(`${baseURL}alternativePartmnetsRoutes/${desireApartment.id}`, formDataDesired, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    userId: parseJwt(token).id
                });
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
            if (error.response)
                if (error.response.status = 403) {
                    setMessage("התחבר שוב לחשבונך")
                    setShowAlert(true)
                    return
                }
            console.error('Error:', error);
            setMessage(' בעדכון הדירה הרצויה אירעה שגיאה.');
            setShowAlert(true)
        }
    }
    const AddDesirePartemnt = async () => {
        console.log(formDataDesired)
        try {
            const responseCurrent = await axios.post(`${baseURL}alternativePartmnetsRoutes`, formDataDesired, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    userId: parseJwt(token).id
                });
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response)
                if (error.response.status = 403) {
                    setMessage("התחבר שוב לחשבונך")
                    setShowAlert(true)
                    return
                }
            setMessage('בהוספת הדירה הרצויה אירעה שגיאה.');
            setShowAlert(true)
        }
    }
    const updateCurrentPartemnt = async () => {
        console.log(formDataCurrent)
        try {
            const responseCurrent = await axios.put(`${baseURL}OnwerParmters/${Apartment.id}`, formDataCurrent, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setMessage('הפרטים התעדכנו בהצלחה!');
                setShowAlert(true)
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    userId: parseJwt(token).id
                });
                setTimeout(() => {
                    dispatch(setModalShow());
                }, 1000);
            } else {

                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
            if (error.response)
                if (error.response.status = 403) {
                    setMessage("התחבר שוב לחשבונך")
                    setShowAlert(true)
                    return
                }
            console.error('Error:', error);
            setMessage('אירעה שגיאה. בעדכון דירה נוכחית');
            setShowAlert(true)
        }

    }
    const AddcurrentPartemnt = async () => {
        console.log(formDataCurrent)
        try {
            const responseCurrent = await axios.post(`${baseURL}OnwerParmters`, formDataCurrent, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setMessage('הפרטים נשלחו בהצלחה!');
                setShowAlert(true)
                setFormDataCurrent({
                    address: Apartment?.address,
                    rooms: Apartment?.rooms,
                    beds: Apartment?.beds,
                    floor: Apartment?.floor,
                    city: Apartment?.city,
                    mattresses: Apartment?.mattresses,
                    preferredSwapDate: Apartment?.preferredSwapDate,
                    notes: Apartment?.notes,
                    userId: parseJwt(token).id
                });

                setTimeout(() => {
                    dispatch(setModalShow());
                }, 1000);
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('אירעה שגיאה. בהוספת דירה נוכחית');
            setShowAlert(true)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setMessage("פג תוקף התחבר שוב")
            setShowAlert(true)
            dispatch(setModalShow())
            logout()
            navigate('../Login')
            return
        }
        console.log(desireApartment, Apartment, formDataDesired)
        if (formDataDesired.numberOfBeds)
            desireApartment ? await updateDesirePartemnt() : await AddDesirePartemnt()
        Apartment ? await updateCurrentPartemnt() : await AddcurrentPartemnt()
    }
    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="custom-modal "
            >
                <Modal.Header closeButton className='d-flex flex-column align-items-center justify-content-center' style={{ borderBottom: 'none' }}>
                    <Modal.Title className="w-100 text-center header fw-bold">
                        טופס עדכון דירה
                    </Modal.Title>

                    <div style={{
                        backgroundColor: "#fff3cd",
                        borderColor: "#ffeeba",
                        color: "#856404",
                        padding: "1rem",
                        marginBottom: "1rem",
                        border: "1px solid transparent",
                        borderRadius: ".25rem",
                        textAlign: "center"
                    }}>
                        <p style={{ margin: 0, fontWeight: "bold" }}>
                            אין להכניס בשום אופן דירות להשכרה. האתר מיועד אך ורק להחלפה.
                        </p>
                    </div>

                </Modal.Header>

                <Modal.Body className='ps-4 pe-4' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <Container className=' mt-0 color-body'>
                        <Form onSubmit={handleSubmit}>
                            <Row className="d-flex align-items-start">
                                <Form.Group className="text-end mb-3" controlId="preferredSwapDate">
                                    <Form.Label className='text-end fw-bold  h-date'>בחר מועד החלפה</Form.Label>

                                    <div>
                                        <Form.Check
                                            type="radio"
                                            label="ראש השנה"
                                            name="preferredSwapDate"
                                            value={1}
                                            checked={formDataCurrent.preferredSwapDate === 1}
                                            onChange={handleChangeCurrent}
                                            className="mb-2"
                                            required
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="יום כיפור"
                                            name="preferredSwapDate"
                                            value={2}
                                            checked={formDataCurrent.preferredSwapDate === 2}
                                            onChange={handleChangeCurrent}
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="שניהם"
                                            name="preferredSwapDate"
                                            value={3}
                                            checked={formDataCurrent.preferredSwapDate === 3}
                                            onChange={handleChangeCurrent}
                                        />
                                    </div>
                                </Form.Group>
                                <Col md={12}>
                                    <h4 className='text-end fw-bold'>פרטי דירה מבוקשת (אינך חייב למלא פרטי דירה מבוקשת)</h4>
                                    <Row className="d-flex align-items-start ">
                                        <Col md={6}>
                                            <Form.Group className="text-end mb-3" controlId="area">
                                                <Form.Label className='label'>אזור רצוי</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    type="text"
                                                    className='text-end text-primary'
                                                    placeholder="הזן כתובת רצויה"
                                                    name="area"
                                                    value={formDataDesired.area}
                                                    onChange={handleChangeDesired}
                                                    required={isAnyFieldFilled()}
                                                />
                                            </Form.Group>

                                            <Form.Group className="text-end mb-3" controlId="numberOfRooms">
                                                <Form.Label className='label'>מספר חדרים רצוי</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    type="number"
                                                    className='text-end text-primary'
                                                    placeholder="הזן מספר חדרים רצוי"
                                                    name="numberOfRooms"
                                                    value={formDataDesired.numberOfRooms}
                                                    onChange={handleChangeDesired}
                                                    required={isAnyFieldFilled()}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="text-end mb-3" controlId="numberOfBeds">
                                                <Form.Label className='label'>מספר מיטות</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    autoComplete="off"
                                                    className='text-end text-primary'
                                                    placeholder="הזן מספר מיטות"
                                                    name="numberOfBeds"
                                                    value={formDataDesired.numberOfBeds}
                                                    onChange={handleChangeDesired}
                                                    required={isAnyFieldFilled()}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={12}>
                                    <h4 className='text-end mt-3 fw-bold'>פרטי הדירה הקיימת</h4>
                                    <Row className="d-flex align-items-start mt-2">

                                        <Col md={6}>
                                            <Form.Group className="text-end mb-3" controlId="city">
                                                <Form.Label className='label'>עיר</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    type="text"
                                                    placeholder="הזן עיר"
                                                    name="city"
                                                    value={formDataCurrent.city}
                                                    onChange={handleChangeCurrent}
                                                    className='text-end text-primary'
                                                    required
                                                />
                                                {cityError && <p className="text-danger text-end">{cityError}</p>}
                                            </Form.Group>

                                            <Form.Group className="text-end mb-3" controlId="rooms">
                                                <Form.Label className='label'>מספר חדרים</Form.Label>
                                                <Form.Control
                                                    className='text-end text-primary'
                                                    type="number"
                                                    placeholder="הזן מספר חדרים"
                                                    name="rooms"
                                                    value={formDataCurrent.rooms}
                                                    onChange={handleChangeCurrent}
                                                    required
                                                    autoComplete="off"
                                                />
                                            </Form.Group>

                                            <Form.Group className="text-end mb-3" controlId="beds">
                                                <Form.Label className='label'>מספר מיטות</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    type="number"
                                                    className='text-end text-primary'
                                                    placeholder="הזן מספר מיטות"
                                                    name="beds"
                                                    value={formDataCurrent.beds}
                                                    onChange={handleChangeCurrent}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="text-end mb-3" controlId="address">
                                                <Form.Label className='label'>כתובת הדירה</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    type="text"
                                                    className='text-end text-primary'
                                                    placeholder="הזן כתובת"
                                                    name="address"
                                                    value={formDataCurrent.address}
                                                    onChange={handleChangeCurrent}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="text-end mb-3" controlId="floor">
                                                <Form.Label className='label'>קומה</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    autoComplete="off"
                                                    className='text-end text-primary'
                                                    placeholder="הזן קומה"
                                                    name="floor"
                                                    value={formDataCurrent.floor}
                                                    onChange={handleChangeCurrent}
                                                    required
                                                />
                                            </Form.Group>



                                            <Form.Group className="text-end mb-3" controlId="mattresses">
                                                <Form.Label className='label'>מזרונים</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    className='text-end text-primary'
                                                    placeholder="הזן מזרונים"
                                                    name="mattresses"
                                                    value={formDataCurrent.mattresses}
                                                    onChange={handleChangeCurrent}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Col className="">
                                        <Form.Group className="text-center mb-3" controlId="notes">
                                            <Form.Label className='label'>הערות</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                as="textarea"
                                                rows={3}
                                                className="text-end w-100 text-primary"
                                                placeholder="הזן הערות"
                                                name="notes"
                                                value={formDataCurrent.notes}
                                                onChange={handleChangeCurrent}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Col>

                            </Row>

                            <div className='d-flex justify-content-center'>
                                <Button
                                    type="submit"
                                    disabled={!isFormValid}
                                    className="w-50 color-black custom-hover"
                                    style={{ border: 'none' }}
                                >
                                    עדכן פרטים
                                </Button></div>
                        </Form>
                    </Container>

                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button className='color-weakblack custom-hover' style={{ border: 'none' }} onClick={deleteDesirApatment} disabled={!desireApartment?.numberOfRooms} >
                        מחק דירה מבוקשת
                    </Button>
                    <Button className='color-weakblack custom-hover' style={{ border: 'none' }} onClick={deletecurrentApartment} disabled={desireApartment?.numberOfBeds || !Apartment?.address} >
                        מחק דירה שברשותי
                    </Button>
                </Modal.Footer>
            </Modal>
            <AlertComponent message={message} setShowAlert={setShowAlert} showAlert={showAlert} />
        </>
    );
};

export default ApartmentForm;
