import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterableTable from './Tables';
import { useSelector } from 'react-redux';
import config from '../config';

const HeadPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    cities: [],
    rooms: "הכל",
    beds: "הכל",
    withWanted: true,
    withoutWanted: true,
    swapDates: [1, 2],
  });

  const baseURL = config.baseUrl;
  const ModalShow = useSelector((state) => state.user.ModalShow);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}users`, {
        params: {
          page,
          limit: 50,
          cities: filters.cities.join(','),
          minRooms: filters.rooms === "הכל" ? undefined : filters.rooms,
          minBeds: filters.beds === "הכל" ? undefined : filters.beds,
          hasWanted: filters.withWanted,
          noWanted: filters.withoutWanted,
          swapDates: filters.swapDates.join(','),
        },
      });
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    // אפס עמוד ל-1 כשמשתנים פילטרים
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [page, ModalShow, filters]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div>
      <FilterableTable users={users} filters={filters} setFilters={setFilters} />
      <div className="pagination-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={prevPage} disabled={page === 1}>← הקודם</button>
        <span style={{ margin: '0 10px' }}>עמוד {page} מתוך {totalPages}</span>
        <button onClick={nextPage} disabled={page === totalPages}>הבא →</button>
      </div>
    </div>
  );
};

export default HeadPage;
