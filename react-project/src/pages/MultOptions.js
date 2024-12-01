import React from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';

function MultiSelectDropdown({ options, selectedOptions, setSelectedOptions, label }) {
    const handleCheckboxChange = (option) => {
        console.log("selectedOptions",selectedOptions)
        if (selectedOptions.includes(option)) {
            // אם האפשרות מסומנת כבר, מסירים אותה
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            // אחרת, מוסיפים אותה
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <DropdownButton
            id="dropdown-multiselect"
            title={label}
            variant="outline-secondary"
            className="w-100 text-end" // יישור לימין
            align="end" // יישור תפריט הקונטקסט לימין
            dir="rtl" // כיוון הכתיבה מימין לשמאל
        >
            <Dropdown.ItemText className="text-end">
                <strong>בחר אפשרויות:</strong>
            </Dropdown.ItemText>
            {options.map((option, index) => (
                <div key={index} className="d-flex align-items-center justify-content-end mx-2" dir="rtl">
                    <Form.Check
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="me-2" // מרחק בין תיבת הבחירה לכיתוב
                        style={{ marginRight: '5px' }} // מרחק נוסף מימין
                    />
                    <label>{option}</label> {/* הכיתוב מופיע אחרי תיבת הבחירה */}
                </div>
            ))}
        </DropdownButton>
    );
}

export default MultiSelectDropdown;
