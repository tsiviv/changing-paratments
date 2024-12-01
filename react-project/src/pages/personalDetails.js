import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setModalShowDetails } from '../features/Users';

function PersonallDetails(props) {
  const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const [IsFormValid, setIsFormValid] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [dataUser, setDataUser] = useState({
    username: user?.username,
    email: user?.email,
  });

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const handleChangeCurrent = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setDataUser({ ...dataUser, email: value });

      if (value && !validateEmail(value)) {
        setEmailError('הכנס מייל תקין');
        setIsFormValid(false); // Disable update button if invalid email
      } else {
        setEmailError('');
        setIsFormValid(true); // Enable the button if the email is valid
      }
    } else {
      setDataUser({ ...dataUser, [name]: value });
    }
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

  const handleUpdate = async () => {
    const id = parseJwt(token).id;

    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/${id}`,
        dataUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      dispatch(setModalShowDetails());
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          הוספת פרטי דירה
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* טופס לעדכון פרטי משתמש */}
        <div>
          <Form.Group className="mb-3 text-end">
            <Form.Label>שם משתמש</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="שם"
              value={dataUser.username}
              onChange={(e) => handleChangeCurrent(e)}
            />
          </Form.Group>

          <Form.Group className="mb-3 text-end">
            <Form.Label>אימייל</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="מייל"
              value={dataUser?.email}
              onChange={(e) => handleChangeCurrent(e)}
            />
            {emailError && (
              <span style={{ color: 'red', fontSize: '0.8rem' }}>{emailError}</span>
            )}
          </Form.Group>

          <Button onClick={handleUpdate} disabled={!IsFormValid}>
            עדכון פרופיל
          </Button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          סגור
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PersonallDetails;
