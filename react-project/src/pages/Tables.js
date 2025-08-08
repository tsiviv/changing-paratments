// נשתמש בגרסה חדשה בה תצוגת הכרטיסים תחליף את הטבלה המסורתית
import  { useEffect, useState } from 'react';
import { Button,  Form } from 'react-bootstrap';
import '../styles/table.css';
import MultiSelectDropdown from './MultOptions';
import config from '../config';

function FilterableCards({ users }) {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState("הכל");
    const [selectedBeds, setSelectedBeds] = useState("הכל");
    const [showWithWanted, setShowWithWanted] = useState(true);
    const [showWithoutWanted, setShowWithoutWanted] = useState(true);
    const [selectedSwapDates, setSelectedSwapDates] = useState([1, 2]);

    const cities = config.cities;
    const numbers = config.numbers;

    const toggleSwapDate = (value) => {
        setSelectedSwapDates(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        );
    };

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
        setShowWithWanted(true);
        setShowWithoutWanted(true);
    };
    function getHolidayLabel(value) {
        switch (Number(value)) {
            case 1:
                return 'ראש השנה';
            case 2:
                return 'יום כיפור';
            case 3:
                return 'ראש השנה ויום כיפור';
            default:
                return '';
        }
    }

    const filterUsers = (users) => {
        return users.filter(user => {
            const cityMatch = selectedCities.length === 0 || selectedCities.includes("הכל") || selectedCities.includes(user.city);
            const roomMatch = selectedRooms === "הכל" || user.rooms >= selectedRooms;
            const bedMatch = selectedBeds === "הכל" || user.beds >= selectedBeds;

            const swapDateMatch =
                user.preferredSwapDate === 3 ||
                selectedSwapDates.length === 0 ||
                selectedSwapDates.includes(user.preferredSwapDate);

            const wantedMatch =
                (showWithWanted && user.hasWantedApartment) ||
                (showWithoutWanted && !user.hasWantedApartment);

            return cityMatch && roomMatch && bedMatch && wantedMatch && swapDateMatch;
        });
    };


    useEffect(() => {
        if (!users || users.length === 0) {
            setFilteredUsers([]);
            return;
        }

        const formattedUsers = users.map((e) => {
            const hasWantedApartment = e.WantedApartments && e.WantedApartments.length > 0;

            return {
                username: e.username,
                email: e.email,
                updatedAt: dateTimepzone(e.updatedAt),
                city: e.Apartments?.[0]?.city,
                address: e.Apartments?.[0]?.address,
                floor: e.Apartments?.[0]?.floor,
                rooms: e.Apartments?.[0]?.rooms,
                beds: e.Apartments?.[0]?.beds,
                mattresses: e.Apartments?.[0]?.mattresses,
                preferredSwapDate: e.Apartments[0].preferredSwapDate,
                numberOfBeds: hasWantedApartment ? e.WantedApartments[0].numberOfBeds : null,
                numberOfRooms: hasWantedApartment ? e.WantedApartments[0].numberOfRooms : null,
                area: hasWantedApartment ? e.WantedApartments[0].area : null,
                notes: e.Apartments?.[0]?.notes,
                hasWantedApartment,
            };
        });

        setFilteredUsers(filterUsers(formattedUsers));
    }, [users, selectedCities, selectedRooms, selectedBeds, showWithWanted, showWithoutWanted, selectedSwapDates]);

    return (
        <div className="cards-view-container">
            <div className="sidebar-filters">
                <h5 className="mb-4">סינון</h5>
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

                <Form.Group >
                    <Form.Label className="fw-bold mt-4">סינון לפי סוג הצעה</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="כולל מי שמבקש דירה חלופית"
                        checked={showWithWanted}
                        onChange={(e) => setShowWithWanted(e.target.checked)}
                        className="mb-2"
                    />
                    <Form.Check
                        type="checkbox"
                        label="כולל מי שמציע בלי לבקש דירה"
                        checked={showWithoutWanted}
                        onChange={(e) => setShowWithoutWanted(e.target.checked)}
                        className="mb-5"
                    />
                </Form.Group>
                <Form.Group className="mb-3 mt-4">
                    <Form.Label className="fw-bold">סינון לפי מועד החלפה</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="ראש השנה"
                        checked={selectedSwapDates.includes(1)}
                        onChange={() => toggleSwapDate(1)}
                        className="mb-2"
                    />
                    <Form.Check
                        type="checkbox"
                        label="יום כיפור"
                        checked={selectedSwapDates.includes(2)}
                        onChange={() => toggleSwapDate(2)}
                        className="mb-5"
                    />
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
                {[...filteredUsers].map((user, idx) => (
                    <div className={`card-box ${!user.hasWantedApartment ? 'no-wanted-apartment' : ''}`} key={idx}>
                        <h5>{user.city} - {user.address}</h5>
                        <p><strong>קומה:</strong> {user.floor}</p>
                        <p><strong>חדרים:</strong> {user.rooms} | <strong>מיטות:</strong> {user.beds} | <strong>מזרונים:</strong> {user.mattresses}</p>
                        <p><strong>מועד החלפה:</strong> {getHolidayLabel(user.preferredSwapDate)}</p>
                        <p><strong>תאריך עדכון:</strong> {user.updatedAt}</p>
                        <p><strong>הערות:</strong> {user.notes}</p>
                        <p><strong>שם:</strong> {user.username}</p>

                        {!user.hasWantedApartment ? (
                            <p className="no-wanted-label"><strong>מציע דירה מבלי לבקש דירה חלופית</strong></p>
                        ) : (
                            <>
                                <p><strong>אזור מועדף:</strong> {user.area}</p>
                                <p><strong> מספר חדרים נצרך:</strong> {user.numberOfRooms}</p>
                                <p><strong>מספר מיטות נצרך:</strong> {user.numberOfBeds}</p>
                            </>
                        )}
                        <a href={`https://mail.google.com/mail/?view=cm&to=${user.email}`} target="_blank" rel="noopener noreferrer">שלח מייל</a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterableCards;