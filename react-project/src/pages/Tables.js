// נשתמש בגרסה חדשה בה תצוגת הכרטיסים תחליף את הטבלה המסורתית
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import '../styles/table.css';
import MultiSelectDropdown from './MultOptions';
import config from '../config';

function FilterableCards({ users }) {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState("הכל");
    const [selectedBeds, setSelectedBeds] = useState("הכל");

    const cities = config.cities;
    const numbers = config.numbers;

    const dateTimepzone = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleString('he-IL', {
            timeZone: 'Asia/Jerusalem',
            hour12: false,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        });
    };

    const cleanOptions = () => {
        setSelectedBeds("הכל");
        setSelectedCities([]);
        setSelectedRooms("הכל");
    };

    const filterUsers = (users) => {
        return users.filter(user => {
            const cityMatch = selectedCities.length === 0 || selectedCities.includes("הכל") || selectedCities.includes(user.city);
            const roomMatch = selectedRooms === "הכל" || user.rooms >= selectedRooms;
            const bedMatch = selectedBeds === "הכל" || user.beds >= selectedBeds;
            return cityMatch && roomMatch && bedMatch;
        });
    };

    useEffect(() => {
        if (!users || users.length === 0) {
            setFilteredUsers([]);
            return;
        }

        const formattedUsers = users.map((e) => ({
            username: e.username,
            email: e.email,
            updatedAt: dateTimepzone(e.updatedAt),
            city: e.Apartments?.[0]?.city,
            address: e.Apartments?.[0]?.address,
            floor: e.Apartments?.[0]?.floor,
            rooms: e.Apartments?.[0]?.rooms,
            beds: e.Apartments?.[0]?.beds,
            mattresses: e.Apartments?.[0]?.mattresses,
            preferredSwapDate: e.WantedApartments?.[0]?.preferredSwapDate,
            numberOfBeds: e.WantedApartments?.[0]?.numberOfBeds,
            numberOfRooms: e.WantedApartments?.[0]?.numberOfRooms,
            area: e.WantedApartments?.[0]?.area,
            notes: e.Apartments?.[0]?.notes,
        }));

        setFilteredUsers(filterUsers(formattedUsers));
    }, [users, selectedCities, selectedRooms, selectedBeds]);

    return (
        <div className="cards-view-container">
            <div className="sidebar-filters">
                <h5>סינון</h5>
                <Form.Group className="mb-3">
                    <Form.Label>מינימום חדרים</Form.Label>
                    <Form.Select value={selectedRooms} onChange={(e) => setSelectedRooms(e.target.value)}>
                        {numbers.map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>מינימום מיטות</Form.Label>
                    <Form.Select value={selectedBeds} onChange={(e) => setSelectedBeds(e.target.value)}>
                        {numbers.map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <MultiSelectDropdown
                    options={cities}
                    selectedOptions={selectedCities}
                    setSelectedOptions={setSelectedCities}
                    label="בחר ערים"
                    className="text-right rtl"
                />

                <Button onClick={cleanOptions} className='mt-3'>נקה סינון</Button>
            </div>

            <div className="cards-wrapper">
                {[...filteredUsers, ...filteredUsers, ...filteredUsers].map((user, idx) => (
                    <div className="card-box" key={idx}>
                        <h5>{user.city} - {user.address}</h5>
                        <p><strong>קומה:</strong> {user.floor}</p>
                        <p><strong>חדרים:</strong> {user.rooms} | <strong>מיטות:</strong> {user.beds} | <strong>מזרונים:</strong> {user.mattresses}</p>
                        <p><strong>אזור מועדף:</strong> {user.area}</p>
                        <p><strong>תאריך מועדף:</strong> {user.preferredSwapDate}</p>
                        <p><strong>תאריך עדכון:</strong> {user.updatedAt}</p>
                        <p><strong>הערות:</strong> {user.notes}</p>
                        <p><strong>שם:</strong> {user.username}</p>
                        <a href={`https://mail.google.com/mail/?view=cm&to=${user.email}`} target="_blank" rel="noopener noreferrer">שלח מייל</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterableCards;