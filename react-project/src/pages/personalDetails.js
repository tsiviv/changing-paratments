import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {setModalShowDetails } from '../features/Users';

function PersonallDetails(props) {
    const user = useSelector((state) => state.user.user); // השתמש ברידוסר הנכון
    const [newEmail, setNewEmail] = useState('');
    const [newName, setNewName] = useState('');
    const token = localStorage.getItem('token');
    const dispatch = useDispatch()
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
        const id = parseJwt(token).id
        const updatedUserData = {
            email: newEmail || user?.email,
            name: newName || user?.username
        };

        try {
            const response = await axios.put(`http://localhost:4000/api/users/${id}`, updatedUserData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
                    <input 
                     className='text-end'
                        type="text"
                        placeholder="New Name"
                        value={newName|| user?.username}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="New Email"
                        value={newEmail || user?.email}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button onClick={handleUpdate}>Update Profile</button>
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
export default PersonallDetails