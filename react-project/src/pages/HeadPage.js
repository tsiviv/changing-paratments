import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterableCards from './FilterableCards';
import { useSelector } from 'react-redux';
import config from '../config';

const HeadPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1); // עמוד נוכחי
  const [totalPages, setTotalPages] = useState(1); // מספר עמודים כולל
  const baseURL = config.baseUrl;

  const ModalShow = useSelector((state) => state.user.ModalShow);

  const fetchUsers = async (page) => {
    try {
      const res = await axios.get(`${baseURL}users?page=${page}&limit=50`);
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page, ModalShow]);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div>
      <FilterableCards users={users} />
      <div className="pagination-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={prevPage} disabled={page === 1}>← הקודם</button>
        <span style={{ margin: '0 10px' }}>עמוד {page} מתוך {totalPages}</span>
        <button onClick={nextPage} disabled={page === totalPages}>הבא →</button>
      </div>
    </div>
  );
};

export default HeadPage;
