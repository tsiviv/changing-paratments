import { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { AiOutlineMessage } from 'react-icons/ai';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import config from '../config';
import '../styles/modalMessage.css';

function SendMessage({ show, setShow }) {
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({ username: "", message: "" });
    const [isLoading, setIsLoading] = useState(false);
    const baseURL = config.baseUrl;

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setSuccessMessage("");
        setErrors({ username: "", message: "" });
    };

    const validateField = (fieldName, value) => {
        if (fieldName === "username" && !value.trim()) return "שדה זה הינו חובה.";
        if (fieldName === "message" && !value.trim()) return "שדה זה הינו חובה.";
        return "";
    };

    const handleInputChange = (fieldName, value) => {
        if (fieldName === "username") setUsername(value);
        else if (fieldName === "message") setMessage(value);

        setErrors(prev => ({ ...prev, [fieldName]: validateField(fieldName, value) }));
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
            const response = await axios.post(`${baseURL}MessageRoutes`, { username, message, rating });
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
            setTimeout(handleClose, 500);
        }
    };

    return (
        <div>
            <div className="message-button" onClick={handleShow}>
                <AiOutlineMessage size={30} />
            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className="modal-header-custom">
                    <Modal.Title className="modal-title-custom">
                        שלח הודעה למערכת
                    </Modal.Title>
                    <button type="button" className="btn-close modal-close-btn" onClick={handleClose} aria-label="Close"></button>
                </Modal.Header>

                <Modal.Body className="modal-body-custom">
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
                            />
                            <Form.Text className="text-danger">{errors.message}</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>דרג את האתר</Form.Label>
                            <div className="star-rating">
                                {[1,2,3,4,5].map(star => (
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

                <Modal.Footer className="d-flex align-items-center justify-content-between">
                    <Button onClick={handleSendMessage} disabled={isLoading} className="update-btn">
                        {isLoading ? <Spinner animation="border" size="sm" /> : "שלח הודעה"}
                    </Button>
                    <Button className="close-btn" onClick={handleClose}>סגור</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SendMessage;
