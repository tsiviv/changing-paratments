import React, { useState, useRef } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setModalShowDetails } from '../features/Users';
import config from '../config';

function PersonallDetails(props) {
  const user = useSelector((state) => state.user.user);
  const [dataUser, setDataUser] = useState({
    username: user?.username,
    email: user?.email,
  });
  const [emailError, setEmailError] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const baseURL = config.baseUrl

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const handleChangeCurrent = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setDataUser({ ...dataUser, email: value });
      if (value && !validateEmail(value)) {
        setEmailError('הכנס מייל תקין');
        setIsFormValid(false);
      } else {
        setEmailError('');
        setIsFormValid(true);
      }
    } else {
      setDataUser({ ...dataUser, [name]: value });
    }
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
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
    const id = parseJwt(token)?.id;
    try {
      const response = await axios.put(
        `${baseURL}users/${id}`,
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isFormValid) {
      handleUpdate();
    } else if (e.key === 'ArrowDown') {
      // למעבר לשדה הבא
      if (document.activeElement === usernameRef.current) {
        emailRef.current.focus();
      }
    } else if (e.key === 'ArrowUp') {
      // למעבר לשדה הקודם
      if (document.activeElement === emailRef.current) {
        usernameRef.current.focus();
      }
    }
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
    >
      <Modal.Header
        className="d-flex justify-content-between"
        style={{ padding: '1rem 1rem' }} // ריווח טוב לכותרת
      >
        <Modal.Title
          style={{
            flexGrow: 1,
            textAlign: 'center',
            marginRight: '10px',
            fontSize: '0.9rem',
          }}
        >
          עדכון פרטים אישיים
        </Modal.Title>
        <button
          type="button"
          className="btn-close"
          onClick={props.onHide}
          aria-label="Close"
          style={{
            width: '1rem',
            height: '1rem',
          }}
        ></button>
      </Modal.Header>

      <Modal.Body style={{ padding: '0.75rem 0.75rem' }}>
        <Form className="text-end" style={{ fontSize: '0.85rem' }}>
          <Form.Group className="mb-2">
            <Form.Label style={{ fontSize: '0.85rem' }}>שם משתמש</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="שם"
              value={dataUser.username}
              onChange={handleChangeCurrent}
              dir="rtl"
              onKeyDown={handleKeyDown}
              ref={usernameRef}
              style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label style={{ fontSize: '0.85rem' }}>אימייל</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="מייל"
              value={dataUser.email}
              onChange={handleChangeCurrent}
              dir="rtl"
              onKeyDown={handleKeyDown}
              ref={emailRef}
              style={{ padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
            />
            {emailError && (
              <span style={{ color: 'red', fontSize: '0.75rem' }}>{emailError}</span>
            )}
          </Form.Group>

          <div className="d-flex justify-content-between mt-3">
            <Button
              onClick={handleUpdate}
              disabled={!isFormValid}
              className="update-btn"
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
            >
              עדכון פרופיל
            </Button>
            <Button
              className="close-btn"
              onClick={props.onHide}
              style={{ fontSize: '0.85rem', padding: '0.35rem 0.6rem' }}
            >
              סגור
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

  );
}

export default PersonallDetails;
