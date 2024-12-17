import { useState, useEffect } from 'react';
// import bootbox from 'bootbox';

const AlertComponent = ({ message, showAlert, setShowAlert }) => {

    useEffect(() => {

        if (showAlert) {

            setTimeout(function () {
                setShowAlert(false); // הסתר את ה-Alert אחרי חצי שניה
            }, 1000);
        }

        return () => clearTimeout(alert); // מניעת זיכרון מיותר
    }, [showAlert, message, setShowAlert]);

    return (
        <>

            {showAlert &&
                <div
                    style={{
                        position: 'fixed',
                        top: '20%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: message.includes('בהצלחה') ? '#d4edda' : '#f8d7da', // ירוק להצלחה, אדום לשגיאה
                        color: message.includes('בהצלחה') ? '#155724' : '#721c24',
                        padding: '1.5rem',
                        borderRadius: '10px',
                        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.15)',
                        zIndex: 9999,
                        textAlign: 'center',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        {message.includes('בהצלחה') ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                height="80"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                style={{ display: 'block', margin: '0 auto' }}
                            >
                                <path d="M7.292 10.207a1 1 0 0 0 1.415 0l4-4a1 1 0 0 0-1.415-1.415L8 8.586 5.707 6.293a1 1 0 1 0-1.414 1.414l3 3z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                height="80"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                style={{ display: 'block', margin: '0 auto' }}
                            >
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                                    style={{
                                        stroke: '#721c24',
                                        strokeWidth: 0.5,
                                    }}
                                />
                            </svg>
                        )}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {message}
                    </div>
                </div>
            }

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
