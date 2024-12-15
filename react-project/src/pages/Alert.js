import { useState, useEffect } from 'react';
// import bootbox from 'bootbox';

const AlertComponent = ({ message, showAlert, setShowAlert }) => {

    // useEffect(() => {
    //     if (showAlert) {
    //         // משתמש ב-bootbox כדי להציג הודעה כמודל
    //         var alert = bootbox.alert({
    //             message: message, // המסר להודעה
    //             size: 'medium', // גודל המודל
    //             backdrop: true, // מאפשר קישוט במודל
    //             centerVertical: true // שומר את המודל במרכז הדף
    //         });

    //         // מראה את המודל
    //         alert.show();

    //         // מחכה ל-4 שניות (4000 מילישניות) לפני הסתרת המודל
    //         setTimeout(function() {
    //             alert.modal('hide');
    //             setShowAlert(false); // הסתר את ה-Alert אחרי חצי שניה
    //         }, 4000);
    //     }
        
    //     return () => clearTimeout(alert); // מניעת זיכרון מיותר
    // }, [showAlert, message, setShowAlert]);

    return (
        <>
        {console.log("show",showAlert)}
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
