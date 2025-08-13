import { Button, Form } from 'react-bootstrap';
import MultiSelectDropdown from './MultOptions';
import config from '../config';
import '../styles/table.css';

function FilterableCards({ citiesOptions, users, filters, setFilters }) {
    const { cities, numbers } = config;

    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const toggleSwapDate = (value) => {
        setFilters((prev) => ({
            ...prev,
            swapDates: prev.swapDates.includes(value)
                ? prev.swapDates.filter((v) => v !== value)
                : [...prev.swapDates, value]
        }));
    };

    const cleanOptions = () => {
        setFilters({
            cities: [],
            rooms: "הכל",
            beds: "הכל",
            withWanted: false,
            withoutWanted: false,
            swapDates: [],
        });
    };

    const getHolidayLabel = (value) => {
        switch (Number(value)) {
            case 1: return 'ראש השנה';
            case 2: return 'יום כיפור';
            case 3: return 'ראש השנה ויום כיפור';
            default: return '';
        }
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

    return (
        <div className="cards-view-container">
            <div className="sidebar-filters">
                <h5 className="mb-4">סינון</h5>
                <Form.Group className="mb-3">
                    <Form.Label>מינימום חדרים</Form.Label>
                    <Form.Select value={filters.rooms} onChange={(e) => updateFilter('rooms', e.target.value)}>
                        {numbers.map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>מינימום מיטות</Form.Label>
                    <Form.Select value={filters.beds} onChange={(e) => updateFilter('beds', e.target.value)}>
                        {numbers.map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="fw-bold mt-4">סינון לפי סוג הצעה</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="כולל מי שמבקש דירה חלופית"
                        checked={filters.withWanted}
                        onChange={(e) => updateFilter('withWanted', e.target.checked)}
                        className="mb-2"
                    />
                    <Form.Check
                        type="checkbox"
                        label="כולל מי שמציע בלי לבקש דירה"
                        checked={filters.withoutWanted}
                        onChange={(e) => updateFilter('withoutWanted', e.target.checked)}
                        className="mb-5"
                    />
                </Form.Group>

                <Form.Group className="mb-3 mt-4">
                    <Form.Label className="fw-bold">סינון לפי מועד החלפה</Form.Label>
                    <Form.Check
                        type="checkbox"
                        label="ראש השנה"
                        checked={filters.swapDates.includes(1)}
                        onChange={() => toggleSwapDate(1)}
                        className="mb-2"
                    />
                    <Form.Check
                        type="checkbox"
                        label="יום כיפור"
                        checked={filters.swapDates.includes(2)}
                        onChange={() => toggleSwapDate(2)}
                        className="mb-5"
                    />
                </Form.Group>

                <MultiSelectDropdown
                    options={citiesOptions}
                    selectedOptions={filters.cities}
                    setSelectedOptions={(value) => updateFilter('cities', value)}
                    label="בחר ערים"
                    className="text-right rtl"
                />

                <Button onClick={cleanOptions} className='mt-3'>נקה סינון</Button>
            </div>

            <div className="cards-wrapper">
                {users.map((user, idx) => (
                    <div className={`card-box ${!user.WantedApartments?.length ? 'no-wanted-apartment' : ''}`} key={idx}>
                        <h5>{user.Apartments?.[0]?.city} - {user.Apartments?.[0]?.address}</h5>
                        <p><strong>קומה:</strong> {user.Apartments?.[0]?.floor}</p>
                        <p><strong>חדרים:</strong> {user.Apartments?.[0]?.rooms} | <strong>מיטות:</strong> {user.Apartments?.[0]?.beds} | <strong>מזרונים:</strong> {user.Apartments?.[0]?.mattresses}</p>
                        <p><strong>מועד החלפה:</strong> {getHolidayLabel(user.Apartments?.[0]?.preferredSwapDate)}</p>
                        <p><strong>תאריך עדכון:</strong> {dateTimepzone(user.updatedAt)}</p>
                        <p><strong>הערות:</strong> {user.Apartments?.[0]?.notes}</p>
                        <p><strong>שם:</strong> {user.username}</p>

                        {!user.WantedApartments?.length ? (
                            <p className="no-wanted-label"><strong>מציע דירה מבלי לבקש דירה חלופית</strong></p>
                        ) : (
                            <>
                                <p><strong>אזור מועדף:</strong> {user.WantedApartments?.[0]?.area}</p>
                                <p><strong>מספר חדרים נצרך:</strong> {user.WantedApartments?.[0]?.numberOfRooms}</p>
                                <p><strong>מספר מיטות נצרך:</strong> {user.WantedApartments?.[0]?.numberOfBeds}</p>
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
