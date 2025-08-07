import React from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';
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

            <div
                className="dropdown-menu-options"
                dir="rtl"
                style={{
                    maxHeight: '150px',
                    overflowY: 'auto',
                    paddingRight: '10px',
                    textAlign: 'right',
                }}
            >
                {options.map((option, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center mb-2" style={{ direction: 'rtl' }}>
                        <label
                            htmlFor={`option-${index}`}
                            style={{
                                margin: 0,
                                flexGrow: 1,
                                textAlign: 'right',
                            }}
                        >
                            {option}
                        </label>
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
