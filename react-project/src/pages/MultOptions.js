import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import '../styles/table.css';

function MultiSelectDropdown({ options, selectedOptions, setSelectedOptions, label }) {
    const handleCheckboxChange = (option) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
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
        >
            <Dropdown.ItemText className="text-end">
                <strong>בחר אפשרויות:</strong>
            </Dropdown.ItemText>

            <div className="dropdown-menu-options" dir="rtl">
                {options.map((option, index) => (
                    <div key={index}>
                        <label htmlFor={`option-${index}`}>{option}</label>
                        <input
                            id={`option-${index}`}
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => handleCheckboxChange(option)}
                        />
                    </div>
                ))}
            </div>
        </DropdownButton>
    );
}

export default MultiSelectDropdown;
