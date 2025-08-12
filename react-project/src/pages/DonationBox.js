// components/DonationBox.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/DonationBox.css';

const DonationBox = () => {
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    return (
        <div ref={boxRef} className="donation-box">
            <h6
                onClick={() => setOpen(!open)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
            >
                לתמיכה בעלויות האתר
            </h6>

            {open && (
                <>
                    <p><strong>חשבון:</strong> 202871004</p>
                    <p><strong>סניף:</strong> 139</p>
                    <p><strong>בנק:</strong> 11</p>
                </>
            )}
        </div>
    );
};

export default DonationBox;
