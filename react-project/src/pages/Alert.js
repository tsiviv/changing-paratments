import { useEffect, useRef } from 'react';
import '../styles/DonationBox.css';

const AlertComponent = ({ message, showAlert, setShowAlert }) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (showAlert) {
      timeoutRef.current = setTimeout(() => {
        setShowAlert(false);
      }, 1000);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [showAlert, setShowAlert]);

  if (!showAlert) return null;

  const isSuccess = message.includes('בהצלחה');

  return (
    <div className={`alert-container ${isSuccess ? 'alert-success' : 'alert-error'}`}>
      <div className="alert-icon">
        {isSuccess ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7.292 10.207a1 1 0 0 0 1.415 0l4-4a1 1 0 0 0-1.415-1.415L8 8.586 5.707 6.293a1 1 0 1 0-1.414 1.414l3 3z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" style={{ strokeWidth: 0.5, stroke: '#721c24' }}>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
        )}
      </div>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{message}</div>
    </div>
  );
};

export default AlertComponent;
