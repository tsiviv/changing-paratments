import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ApartmentForm from './ApartmentForm';
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        
      </Modal.Header>
      <Modal.Body>
        <ApartmentForm />
      </Modal.Body>
      <Modal.Footer>
       
      </Modal.Footer>
    </Modal>
  );
}
export default MyVerticallyCenteredModal