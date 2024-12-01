import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AiOutlineMessage } from 'react-icons/ai'; // ספריית אייקונים פופולרית
import axios from 'axios';

function SendMessage({ show, setShow }) {
    const [message, setMessage] = useState(""); // אחסון ההודעה
    const [username, setUsername] = useState(""); // שם השולח
    const [successMessage, setSuccessMessage] = useState(""); // הודעת הצלחה

    // פתיחה וסגירה של המודל
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        setSuccessMessage("");
    };

    // שליחת ההודעה
    const handleSendMessage = async () => {
        if (!message.trim() || !username.trim()) {
            alert("אנא מלאו את כל השדות.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/api/MessageRoutes", { username, message });
            if (response.status === 201) {
                setSuccessMessage("הודעתך נשלחה בהצלחה!");
                setMessage("");
                setUsername("");
            } else {
                setSuccessMessage("שגיאה בשליחת ההודעה. נסו שוב מאוחר יותר.");
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setSuccessMessage("חסר שדות");
                return;
            }
            console.error("Error sending message:", error);
            setSuccessMessage("שגיאה בשליחת ההודעה.");
        }
    };

    return (
        <div>
            {/* אייקון לפתיחת המודל */}
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

            {/* מודל לשליחת ההודעה */}
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header style={{ direction: "rtl", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Modal.Title style={{ flex: 1, textAlign: "center" }}>שלח הודעה למערכת</Modal.Title>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={handleClose}
                        aria-label="Close"
                        style={{ position: "absolute", right: "10px" }}
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
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{ textAlign: "right" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="message">
                            <Form.Label>תוכן ההודעה</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="כתוב את ההודעה שלך כאן"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                style={{ textAlign: "right" }}
                            />
                        </Form.Group>
                    </Form>
                    {successMessage && <p className="text-success">{successMessage}</p>}
                </Modal.Body>
                <Modal.Footer style={{ direction: "rtl", justifyContent: "space-between" }}>
                    <Button variant="secondary" onClick={handleClose}>
                        סגור
                    </Button>
                    <Button variant="primary" onClick={handleSendMessage}>
                        שלח הודעה
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SendMessage;
