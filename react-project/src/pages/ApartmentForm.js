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
    console.log("console", Apartment?.address)
    const [formDataCurrent, setFormDataCurrent] = useState({
        address: Apartment?.address || '',
        rooms: Apartment?.rooms || '',
        beds: Apartment?.beds || '',
        floor: Apartment?.floor || '',
        city: Apartment?.city || '',
        mattresses: Apartment?.mattresses || '',
        notes: Apartment?.notes || '',
        userId: parseJwt(token)?.id
    });



    console.log("sososoos", formDataCurrent, Apartment);
    const [formDataDesired, setFormDataDesired] = useState({
        numberOfRooms: desireApartment?.numberOfRooms,
        numberOfBeds: desireApartment?.numberOfBeds,
        area: desireApartment?.area,
        preferredSwapDate: desireApartment?.preferredSwapDate,
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
                notes: Apartment.notes
            });
            setFormDataDesired({
                numberOfRooms: desireApartment?.numberOfRooms,
                numberOfBeds: desireApartment?.numberOfBeds,
                area: desireApartment?.area,
                preferredSwapDate: desireApartment?.preferredSwapDate,
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
            userId: parseJwt(token)?.id
        })
        setFormDataDesired({
            numberOfRooms: desireApartment?.numberOfRooms,
            numberOfBeds: desireApartment?.numberOfBeds,
            area: desireApartment?.area,
            preferredSwapDate: desireApartment?.preferredSwapDate,
            userId: parseJwt(token)?.id
        })
    }, [navigate, token]);
    const isAnyFieldFilled = () => {
        console.log(formDataDesired.area)
        return (
            formDataDesired.area ||
            formDataDesired.numberOfRooms ||
            formDataDesired.numberOfBeds ||
            formDataDesired.preferredSwapDate
        );
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
        const inputLower = input.toLowerCase().trim(); // הופכים את המילה לאותיות קטנות
        const inputWords = inputLower.split(/\s+/); // מפרקים את המשפט למילים לפי רווחים

        // מחפשים אם לפחות אחת מהמילים של המשתמש קיימת במערך הערים
        return inputWords.some(word =>
            config.cities.some(city => {
                const cityWords = city.toLowerCase().split(/\s+/); // מפרקים את שם העיר למילים
                return cityWords.includes(word); // בודקים אם המילה קיימת ברשימת המילים של העיר
            })
        );
    }



    const deleteDesirApatment = async () => {
        try {
            const responseCurrent = await axios.delete(`http://localhost:4000/api/alternativePartmnetsRoutes/${desireApartment.id}`, {
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
                    preferredSwapDate: "",
                    userId: ""
                });
                setTimeout(() => {
                    dispatch(setModalShow());
                }, 1000);
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)

            }
        } catch (error) {
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
            const responseCurrent = await axios.delete(`http://localhost:4000/api/OnwerParmters/${Apartment.id}`, formDataCurrent, {
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
                    city: "",
                    mattresses: "",
                    notes: "",
                    userId: parseJwt(token)?.id
                });
                setTimeout(() => {
                    dispatch(setModalShow());
                }, 1000);
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
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
            setFormDataCurrent({ ...formDataCurrent, [name]: value });
        }
    };
    const handleChangeDesired = (e) => {
        const { name, value } = e.target;
        setFormDataDesired({ ...formDataDesired, [name]: value });
    };
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY
    // פונקציה לשלוח את ההערה ל-OpenAI API
    const checkForRentalOrMoney = async (text) => {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions', // נתיב חדש לשירות Chat GPT
                {
                    model: 'gpt-3.5-turbo', // מודל עדכני יותר
                    messages: [
                        {
                            role: 'system',
                            content: 'השתמש בשפה העברית.'
                        },
                        {
                            role: 'user',
                            content: `האם יש בהערה הבאה איזכור של השכרה או כסף? אם כן, השב 'כן'. אם לא, השב 'לא': ${text}`
                        }
                    ],
                    max_tokens: 60,
                    temperature: 0.2,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${openaiApiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const result = response.data.choices[0].message.content.trim(); // שים לב לשינוי במבנה התשובה
            console.log(result);
            return result.toLowerCase() === 'כן';
        } catch (error) {
            console.error('Error checking text:', error);
            return false;
        }
    };

    const updateDesirePartemnt = async () => {
        try {
            const responseCurrent = await axios.put(`http://localhost:4000/api/alternativePartmnetsRoutes/${desireApartment.id}`, formDataDesired, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    preferredSwapDate: desireApartment?.preferredSwapDate,
                    userId: parseJwt(token).id
                });
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
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
            const responseCurrent = await axios.post(`http://localhost:4000/api/alternativePartmnetsRoutes`, formDataDesired, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (responseCurrent.status == 200 || responseCurrent.status == 201) {
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    preferredSwapDate: desireApartment?.preferredSwapDate,
                    userId: parseJwt(token).id
                });
            } else {
                setMessage('שגיאה בשליחת הפרטים.');
                setShowAlert(true)
            }
        } catch (error) {
            console.error('Error:', error);
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
        try {
            const responseCurrent = await axios.put(`http://localhost:4000/api/OnwerParmters/${Apartment.id}`, formDataCurrent, {
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
                    preferredSwapDate: desireApartment?.preferredSwapDate,
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
            const responseCurrent = await axios.post(`http://localhost:4000/api/OnwerParmters`, formDataCurrent, {
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
        console.log()
        // console.log(await checkForRentalOrMoney(formDataCurrent.notes))
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
                <Modal.Header closeButton className=' d-flex align-items-center justify-content-center'
                    style={{ borderBottom: 'none' }}
                >
                    <Modal.Title className="w-100 text-center header fw-bold">טופס עדכון דירה</Modal.Title>
                </Modal.Header>
                <Modal.Body className=' ps-4 pe-4 '>
                    <Container className=' mt-0 color-body'>
                        <Form onSubmit={handleSubmit}>
                            <Row className="d-flex align-items-start">
                                {/* First Form: Current Apartment */}
                                {/* Second Form: Desired Apartment */}
                                <Col md={12}>
                                    <h4 className='text-end fw-bold'>פרטי דירה מבוקשת (אינך חייב למלא פרטי דירה מבוקשת)</h4>
                                    <Row className="d-flex align-items-start ">
                                        {/* First Form: Current Apartment */}
                                        {/* Second Form: Desired Apartment */}
                                        {console.log("SAD", formDataCurrent.address)}
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

                                            <Form.Group className="text-end mb-3" controlId="preferredSwapDate">
                                                <Form.Label className='label'>תאריך מועדף להחלפה</Form.Label>
                                                <Form.Control
                                                    autoComplete="off"
                                                    className='text-end text-primary'
                                                    style={{ color: 'blue' }}
                                                    type="text"
                                                    name="preferredSwapDate"
                                                    value={formDataDesired.preferredSwapDate}
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
                                        {/* First Form: Current Apartment */}
                                        {/* Second Form: Desired Apartment */}
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
                                                required
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

                    {console.log(desireApartment)
                    }                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none' }}>
                    <Button className='color-weakblack custom-hover' style={{ border: 'none' }} onClick={deleteDesirApatment} disabled={!desireApartment?.preferredSwapDate} >
                        מחק שירה מבוקשת
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
