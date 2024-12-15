import { useState, useEffect } from 'react';
// import bootbox from 'bootbox';

const AlertComponent = ({ message, showAlert, setShowAlert }) => {

    useEffect(() => {

        if (showAlert) {

            setTimeout(function () {
                setShowAlert(false); // הסתר את ה-Alert אחרי חצי שניה
            }, 700);
        }

        return () => clearTimeout(alert); // מניעת זיכרון מיותר
    }, [showAlert, message, setShowAlert]);

    return (
        <>
        {showAlert&&
            <div
                style={{
                    position: 'fixed',
                    top: '20%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                    textAlign: 'center',
                }}
            >
                {message}
            </div>}
            {/* {showAlert && (
                // זה מודל `bootbox` ולא `div.alert`
                <div id="bootbox-alert" className="bootbox modal fade show" role="dialog">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-body">
                                {message}
                                <button type="button" className="btn-close" onClick={() => setShowAlert(false)}></button>
                            </div>
                        </div>
                    </div>
                </div> */}
            {/* )} */}
        </>
    );
};

export default AlertComponent;
