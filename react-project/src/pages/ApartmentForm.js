import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux'; // שימוש ב-hook כדי לגשת ל-state הגלובלי
import { setModalShow, logout } from '../features/Users';
import { useDispatch } from 'react-redux';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const ApartmentForm = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const desireApartment = useSelector((state) => state.desirePartment.desireApartment)?.[0]; // השתמש ברידוסר הנכון
    const Apartment = useSelector((state) => state.Apartment.Apartment)?.[0]; // השתמש ברידוסר הנכון
    const dispatch = useDispatch()
    const [isFormValid, setIsFormValid] = useState(true); // מצב תקינות הטופס
    const [cityError, setCityError] = useState("");
    const [formDataCurrent, setFormDataCurrent] = useState({
        address: Apartment?.address,
        rooms: Apartment?.rooms,
        beds: Apartment?.beds,
        floor: Apartment?.floor,
        city: Apartment?.city,
        mattresses: Apartment?.mattresses,
        notes: Apartment?.notes,
        userId: parseJwt(token)?.id
    });

    const [formDataDesired, setFormDataDesired] = useState({
        numberOfRooms: desireApartment?.numberOfRooms,
        numberOfBeds: desireApartment?.numberOfBeds,
        area: desireApartment?.area,
        preferredSwapDate: desireApartment?.preferredSwapDate,
        userId: parseJwt(token)?.id
    });
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // dispatch(setModalShow(false))
            return
            // navigate('../login'); // הפניה לדף ההתחברות אם לא נמצא טוקן
        }
    }, [navigate, token]);
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
                alert('הפרטים התעדכנו בהצלחה!');
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    preferredSwapDate: desireApartment?.preferredSwapDate,
                    userId: parseJwt(token).id
                });
            } else {
                alert('שגיאה בשליחת הפרטים.');
            }
        } catch (error) {
            if (error.response.status = 403) {
                alert("התחבר שוב לחשבונך")
                return
            }
            console.error('Error:', error);
            alert(' בעדכון הדירה הרצויה אירעה שגיאה.');
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
                alert('הפרטים נשלחו בהצלחה!');
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    preferredSwapDate: desireApartment?.preferredSwapDate,
                    userId: parseJwt(token).id
                });
            } else {
                alert('שגיאה בשליחת הפרטים.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response.status = 403) {
                alert("התחבר שוב לחשבונך")
                return
            }
            alert('בהוספת הדירה הרצויה אירעה שגיאה.');
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
                alert('הפרטים התעדכנו בהצלחה!');
                setFormDataDesired({
                    numberOfRooms: desireApartment?.numberOfRooms,
                    numberOfBeds: desireApartment?.numberOfBeds,
                    area: desireApartment?.area,
                    preferredSwapDate: desireApartment?.preferredSwapDate,
                    userId: parseJwt(token).id
                });
                dispatch(setModalShow());
            } else {

                alert('שגיאה בשליחת הפרטים.');
            }
        } catch (error) {
            if (error.response.status = 403) {
                alert("התחבר שוב לחשבונך")
                return
            }
            console.error('Error:', error);
            alert('אירעה שגיאה. בעדכון דירה נוכחית');
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
                alert('הפרטים נשלחו בהצלחה!');
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
                dispatch(setModalShow());
            } else {
                alert('שגיאה בשליחת הפרטים.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('אירעה שגיאה. בהוספת דירה נוכחית');
        }
    }
    const handleSubmit = async (e) => {
        // console.log(await checkForRentalOrMoney(formDataCurrent.notes))
        e.preventDefault();
        if (!token) {
            alert("פג תוקף התחבר שוב")
            dispatch(setModalShow())
            logout()
            return
        }
        console.log(desireApartment, Apartment)
        desireApartment ? await updateDesirePartemnt() : await AddDesirePartemnt()
        Apartment ? await updateCurrentPartemnt() : await AddcurrentPartemnt()
    }
    return (
        <Container className="mt-5">
            <Form onSubmit={handleSubmit}>
                <Row className="d-flex align-items-start">
                    {/* First Form: Current Apartment */}
                    {/* Second Form: Desired Apartment */}
                    <Col md={6}>
                        <h4 className='text-end'>פרטי הדירה המבוקשת</h4>
                        <Form.Group className="text-end mb-3" controlId="area">
                            <Form.Label>אזור רצוי</Form.Label>
                            <Form.Control
                                type="text"
                                className='text-end'
                                placeholder="הזן כתובת רצויה"
                                name="area"
                                value={formDataDesired.area}
                                onChange={handleChangeDesired}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="numberOfRooms">
                            <Form.Label>מספר חדרים רצוי</Form.Label>
                            <Form.Control
                                type="number"
                                className='text-end'
                                placeholder="הזן מספר חדרים רצוי"
                                name="numberOfRooms"
                                value={formDataDesired.numberOfRooms}
                                onChange={handleChangeDesired}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="numberOfBeds">
                            <Form.Label>מספר מיטות</Form.Label>
                            <Form.Control
                                type="number"
                                className='text-end'
                                placeholder="הזן מספר מיטות"
                                name="numberOfBeds"
                                value={formDataDesired.numberOfBeds}
                                onChange={handleChangeDesired}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="preferredSwapDate">
                            <Form.Label>תאריך מועדף להחלפה</Form.Label>
                            <Form.Control
                                className='text-end'
                                type="text"
                                name="preferredSwapDate"
                                value={formDataDesired.preferredSwapDate}
                                onChange={handleChangeDesired}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <h4 className='text-end'>פרטי הדירה הקיימת</h4>
                        <Form.Group className="text-end mb-3" controlId="address">
                            <Form.Label>כתובת הדירה</Form.Label>
                            <Form.Control
                                type="text"
                                className='text-end'
                                placeholder="הזן כתובת"
                                name="address"
                                value={formDataCurrent.address}
                                onChange={handleChangeCurrent}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="rooms">
                            <Form.Label>מספר חדרים</Form.Label>
                            <Form.Control
                                className='text-end'
                                type="number"
                                placeholder="הזן מספר חדרים"
                                name="rooms"
                                value={formDataCurrent.rooms}
                                onChange={handleChangeCurrent}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="beds">
                            <Form.Label>מספר מיטות</Form.Label>
                            <Form.Control
                                type="number"
                                className='text-end'
                                placeholder="הזן מספר מיטות"
                                name="beds"
                                value={formDataCurrent.beds}
                                onChange={handleChangeCurrent}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="floor">
                            <Form.Label>קומה</Form.Label>
                            <Form.Control
                                type="number"
                                className='text-end'
                                placeholder="הזן קומה"
                                name="floor"
                                value={formDataCurrent.floor}
                                onChange={handleChangeCurrent}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="city">
                            <Form.Label>עיר</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="הזן עיר"
                                name="city"
                                value={formDataCurrent.city}
                                onChange={handleChangeCurrent}
                                className='text-end'
                                required
                            />
                            {cityError && <p className="text-danger text-end">{cityError}</p>}
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="mattresses">
                            <Form.Label>מזרונים</Form.Label>
                            <Form.Control
                                type="text"
                                className='text-end'
                                placeholder="הזן מזרונים"
                                name="mattresses"
                                value={formDataCurrent.mattresses}
                                onChange={handleChangeCurrent}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="text-end mb-3" controlId="notes">
                            <Form.Label>הערות</Form.Label>
                            <Form.Control
                                type="text"
                                className='text-end'
                                placeholder="הזן הערות"
                                name="notes"
                                value={formDataCurrent.notes}
                                onChange={handleChangeCurrent}
                                required
                            />
                        </Form.Group>
                    </Col>

                </Row>

                <Button variant="primary" type="submit" className="w-100" disabled={!isFormValid}>
                    שלח פרטים
                </Button>
            </Form>
        </Container>
    );
};

export default ApartmentForm;
