import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import '../styles/table.css';

function FilterableTable({ users }) {
    const [newUser, setNewUser] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null); // לשמור על השורה המורחבת
    const [sortColumn, setSortColumn] = useState("updatedAt"); // העמודה הנוכחית למיון
    const [sortDirection, setSortDirection] = useState('asc'); // כיוון המיון ('asc' או 'desc')

    // פונקציה לעדכון timezone
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

    useEffect(() => {
        const formattedUsers = users?.map((e) => ({
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
        setNewUser(formattedUsers);
    }, [users]);

    // פונקציה למיון
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
            {newUser ? (
                <div className="table-container">
                    <Table className="table table-striped table-hover">
                        <thead className="thead">
                            <tr className="text-end">
                                {[
                                    { label: 'תאריך', key: 'updatedAt' },
                                    { label: 'עיר', key: 'city' },
                                    { label: 'שכונה', key: 'address' },
                                    { label: 'קומה', key: 'floor' },
                                    { label: 'מס חדרים', key: 'rooms' },
                                    { label: 'מס מיטות', key: 'beds' },
                                    { label: 'מזרונים', key: 'mattresses' },
                                    { label: 'תאריכים מועדפים', key: 'preferredSwapDate' },
                                    { label: 'אזור מועדף', key: 'area' },
                                    { label: 'מס מיטות נדרש', key: 'numberOfBeds' },
                                    { label: 'מס חדרים נדרש', key: 'numberOfRooms' },
                                ].map(({ label, key }) => (
                                    <th
                                        key={key}
                                        className="sortable-column"
                                        onClick={() => handleSort(key)}
                                    >
                                        {label}{' '}
                                        {sortColumn === key && (
                                            <span>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {newUser.map((e, index) => (
                                <React.Fragment key={index}>
                                    <tr className="text-end">
                                        <td>{e.updatedAt}</td>
                                        <td>{e.city}</td>
                                        <td>{e.address}</td>
                                        <td>{e.floor}</td>
                                        <td>{e.rooms}</td>
                                        <td>{e.beds}</td>
                                        <td>{e.mattresses}</td>
                                        <td>{e.preferredSwapDate}</td>
                                        <td>{e.area}</td>
                                        <td>{e.numberOfBeds}</td>
                                        <td>{e.numberOfRooms}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => setExpandedRow(expandedRow === index ? null : index)}
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
            ) : (
                <></>
            )}
        </>
    );
}

export default FilterableTable;
