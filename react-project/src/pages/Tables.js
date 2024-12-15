import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Form, Collapse, Accordion } from 'react-bootstrap';
import '../styles/table.css';
import MultiSelectDropdown from './MultOptions';
import config from '../config';

function FilterableTable({ users }) {
    const [newUser, setNewUser] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null); // Track the expanded row
    const [sortColumn, setSortColumn] = useState("updatedAt"); // Current sorting column
    const [sortDirection, setSortDirection] = useState('asc'); // Sort direction ('asc' or 'desc')
    const [hoveredColumn, setHoveredColumn] = useState(null); // Column hover state
    const [selectedCities, setSelectedCities] = useState([]); // Filter for selected cities
    const [selectedRooms, setSelectedRooms] = useState("הכל"); // Filter for selected rooms
    const [selectedBeds, setSelectedBeds] = useState("הכל"); // Filter for selected beds

    const cleanOptions = () => {
        setSelectedBeds();
        setSelectedCities([]);
        setSelectedRooms();
    };

    // List of possible cities and numbers
    const cities = config.cities;
    const numbers = config.numbers;

    // Format date to include timezone
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

    // Filter by selected city
    const filterByCity = (user) => {
        if (selectedCities.length == 0) return true; // Show all if no cities selected
        if (selectedCities.includes("הכל")) return true;
        return selectedCities.includes(user.city);
    };

    // Filter by selected rooms
    const filterByRooms = (user) => {
        if (!selectedRooms) return true; // Show all if no rooms selected
        if (selectedRooms == "הכל") return true;
        if (selectedRooms == "מספר חדרים נדרש") return true;
        if (selectedRooms == "יותר מ 12") return user.rooms >= 12;
        return user.rooms >= selectedRooms; // Check if user.beds is greater than the selected number
    };

    // Filter by selected beds
    const filterByBeds = (user) => {
        if (!selectedBeds) return true; // Show all if no beds selected
        if (selectedBeds == "הכל") return true;
        if (selectedRooms == "מספר מיטות נדרש") return true;
        if (selectedBeds == "יותר מ 12") return user.beds >= 12;
        console.log(selectedBeds)
        return user.beds >= selectedBeds; // Check if user.beds is greater than the selected number
    };

    // Combined filter function
    const filterUsers = (formattedUsers) => {
        const arr = formattedUsers.filter((user) => filterByCity(user) && filterByRooms(user) && filterByBeds(user));
        console.log(arr);
        return arr;
    };

    useEffect(() => {
        if (!users || users.length === 0) {
            setNewUser([]); // If no users, set empty array
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
        console.log("useefect");

        // Filter users by selected city, rooms, and beds
        const filteredUsers = filterUsers(formattedUsers);

        setNewUser(filteredUsers);
    }, [users, selectedCities, selectedRooms, selectedBeds]); // Include selectedRooms and selectedBeds to update users when filters change

    // Sort function
    const handleSort = (column) => {
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);

        const sortedData = [...newUser].sort((a, b) => {
            if (a[column] === null || a[column] === undefined) return 1;
            if (b[column] === null || b[column] === undefined) return -1;

            const compareA = typeof a[column] === 'string' ? a[column].toLowerCase() : a[column];
            const compareB = typeof b[column] === 'string' ? b[column].toLowerCase() : b[column];

            if (newDirection === 'asc') {
                return compareA > compareB ? 1 : -1;
            } else {
                return compareA < compareB ? 1 : -1;
            }
        });

        setNewUser(sortedData);
    };

    return (
        <>
            <div className="table-container">
                {/* Search and filter row */}

                <Table className="table table-striped table-hover">
                    <thead className="thead">
                        <tr class="table-header-extra">
                            <th colspan="11" className="p-2 table-header-extra" scope="row"><div className="table-header-extra d-flex justify-content-around align-items-center m-0">

                                <Form.Group className="me-2 d-flex align-items-center ">
                                    <Form.Select
                                        aria-label="מספר חדרים נדרש"
                                        value={selectedRooms}
                                        onChange={(e) => setSelectedRooms(e.target.value)}
                                        className="w-auto"
                                        dir='rtl'
                                    >
                                        {numbers.map((e) => (
                                            <option key={e} value={e}>
                                                {e}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Label className='ms-2 mb-0 text-white'>מספר חדרים נדרש</Form.Label>
                                </Form.Group>

                                <Form.Group className="me-2 d-flex align-items-center ">
                                    <Form.Select
                                        aria-label="מספר מיטות נדרש"
                                        value={selectedBeds}
                                        onChange={(e) => setSelectedBeds(e.target.value)}
                                        className="w-auto"
                                        dir='rtl'
                                    >
                                        {numbers.map((e) => (
                                            <option key={e} value={e}>
                                                {e}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Label className="mb-0 ms-2 text-white">מספר מיטות נדרש</Form.Label>
                                </Form.Group>

                                <MultiSelectDropdown
                                    options={cities}
                                    selectedOptions={selectedCities}
                                    setSelectedOptions={setSelectedCities}
                                    label="בחר ערים רצויות להחלפה"
                                    className="me-2"
                                    dir='rtl'
                                />
                                <Button onClick={cleanOptions} >נקה בחירה</Button>
                            </div>
                            </th>
                        </tr>
                        <tr className="text-end p-2 table-dark">
                            {[{ label: 'מס חדרים נדרש', key: 'numberOfRooms' },
                            { label: 'מס מיטות נדרש', key: 'numberOfBeds' },
                            { label: 'אזור מועדף', key: 'area' },
                            { label: 'תאריכים מועדפים', key: 'preferredSwapDate' },
                            { label: 'מזרונים', key: 'mattresses' },
                            { label: 'מס מיטות', key: 'beds' },
                            { label: 'מס חדרים', key: 'rooms' },
                            { label: 'קומה', key: 'floor' },
                            { label: 'שכונה', key: 'address' },
                            { label: 'עיר', key: 'city' },
                            { label: 'תאריך', key: 'updatedAt' },
                            ].map(({ label, key }) => (
                                <th
                                    key={key}
                                    className="sortable-column"
                                    onClick={() => handleSort(key)}
                                    onMouseEnter={() => setHoveredColumn(key)}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                    style={['numberOfRooms', 'numberOfBeds', 'area', 'preferredSwapDate'].includes(key) ? { fontSize: '0.8rem' } : {}}
                                >
                                    {label}{' '}
                                    {sortColumn === key && (
                                        <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                                    )}
                                    {hoveredColumn === key && sortColumn !== key && (
                                        <span>{'▲▼'}</span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {newUser.map((e, index) => (
                            <React.Fragment key={index}>
                                <tr className="text-end">
                                    <td>{e.numberOfRooms}</td>
                                    <td>{e.numberOfBeds}</td>
                                    <td>{e.area}</td>
                                    <td>{e.preferredSwapDate}</td>
                                    <td>{e.mattresses}</td>
                                    <td>{e.beds}</td>
                                    <td>{e.rooms}</td>
                                    <td>{e.floor}</td>
                                    <td>{e.address}</td>
                                    <td>{e.city}</td>
                                    <td>{e.updatedAt}</td>
                                    <td>
                                        <Button
                                            onClick={() =>
                                                setExpandedRow(
                                                    expandedRow === index ? null : index
                                                )
                                            }
                                            variant="outline-primary"
                                        >
                                            {expandedRow === index ? '-' : '+'}
                                        </Button>
                                    </td>
                                </tr>
                                {expandedRow === index && (
                                    <tr>
                                        <td colSpan="12">
                                            <div dir="rtl" className="text-end">
                                                <p>
                                                    <strong>מייל</strong>:{' '}
                                                    <a
                                                        href={`https://mail.google.com/mail/?view=cm&to=${e.email}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        לחץ לשליחת מייל
                                                    </a>
                                                </p>
                                                <p>
                                                    <strong>שם</strong>: {e.username}
                                                </p>
                                                <p>
                                                    <strong>מידע נוסף על הדירה או הערות על ההחלפה</strong>:{' '}
                                                    {e.notes}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default FilterableTable;
