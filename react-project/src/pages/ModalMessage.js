import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { AiOutlineMessage } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { setModalShow } from '../features/Users';

function SendMessage({ show, setShow }) {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({ username: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setSuccessMessage("");
        setErrors({ username: "", message: "" });
        console.log("כבר נכנסתי לפסק הזמן");
        console.log("כבר נכנסתי לפסק הזמן");

    };

    const validateField = (fieldName, value) => {
        if (fieldName === "username" && !value.trim()) {
            return "שדה זה הינו חובה.";
        }
        if (fieldName === "message" && !value.trim()) {
            return "שדה זה הינו חובה.";
        }
        return "";
    };

    const handleInputChange = (fieldName, value) => {
        if (fieldName === "username") {
            setUsername(value);
        } else if (fieldName === "message") {
            setMessage(value);
        }

        // עדכון השגיאה של השדה לפי המצב החדש
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: validateField(fieldName, value),
        }));
    };

    const handleSendMessage = async () => {
        const newErrors = {
            username: validateField("username", username),
            message: validateField("message", message),
        };

        if (newErrors.username || newErrors.message) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:4000/api/MessageRoutes", { username, message, rating });
            if (response.status === 201) {
                setSuccessMessage("הודעתך נשלחה בהצלחה!");
                setMessage("");
                setUsername("");
                setRating(5);
            } else {
                setSuccessMessage("שגיאה בשליחת ההודעה. נסו שוב מאוחר יותר.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setSuccessMessage("שגיאה בשליחת ההודעה.");
        } finally {
            setIsLoading(false);
            setTimeout(() => {
                console.log("Sd/fdg")
                handleClose()
            }, 500);
        }
    };

    return (
        <div>
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    cursor: "pointer",
                    background: "#007bff",
                    borderRadius: "50%",
                    padding: "15px",
                    color: "white",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
                }}
                onClick={handleShow}
            >
                <AiOutlineMessage size={30} />
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header
                    style={{
                        direction: "rtl",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <Modal.Title
                        style={{
                            flexGrow: 1,
                            textAlign: "center",
                            marginRight: "40px",
                        }}
                    >
                        שלח הודעה למערכת
                    </Modal.Title>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={handleClose}
                        aria-label="Close"
                        style={{
                            position: "absolute",
                            right: "10px",
                        }}
                    ></button>
                </Modal.Header>

                <Modal.Body style={{ direction: "rtl", textAlign: "right" }}>
                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>שם</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="הכנס שם"
                                value={username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                                isInvalid={!!errors.username}
                                required
                                style={{ textAlign: "right" }}
                            />
                            <Form.Text className="text-danger">{errors.username}</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="message">
                            <Form.Label>תוכן ההודעה</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="כתוב את ההודעה שלך כאן"
                                value={message}
                                onChange={(e) => handleInputChange("message", e.target.value)}
                                isInvalid={!!errors.message}
                                required
                                style={{ textAlign: "right" }}
                            />
                            <Form.Text className="text-danger">{errors.message}</Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>דרג את האתר</Form.Label>
                            <div>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        size={30}
                                        color={star <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9"}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        style={{ cursor: "pointer" }}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Form>
                    {successMessage && <p className="text-success">{successMessage}</p>}
                </Modal.Body>
                <Modal.Footer style={{ direction: "rtl" }}>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        disabled={isLoading}
                    >
                        {isLoading ? <Spinner animation="border" size="sm" /> : "שלח הודעה"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SendMessage;
