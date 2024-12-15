import React from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
import '../styles/table.css';

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
        className="text-end"
        align="end"
        dir="rtl"
        container="body"
    >
        <Dropdown.ItemText className="text-end">
            <strong>בחר אפשרויות:</strong>
        </Dropdown.ItemText>
        <div className="dropdown-menu-options" dir='rtl'>
            {options.map((option, index) => (
                <div key={index} className="d-flex align-items-center justify-content-end mx-2" dir="rtl">
                    <Form.Check
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="me-2"
                        dir='rtl'
                    />
                    <label dir='rtl'>{option}</label>
                </div>
            ))}
        </div>
    </DropdownButton>
    
    );
}

export default MultiSelectDropdown;
