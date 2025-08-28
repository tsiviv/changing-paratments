import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterableTable from './Tables';
import { useSelector } from 'react-redux';
import config from '../config';
import DonationBox from './DonationBox';
import '../styles/table.css';

const HeadPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    cities: [],
    rooms: "הכל",
    beds: "הכל",
    withWanted: false,
    withoutWanted: false,
    swapDates: [],
  });
  const cities = config.cities
  const [citiesOptions, setcitiesOptions] = useState([])
  const baseURL = config.baseUrl;
  const ModalShow = useSelector((state) => state.user.ModalShow);

  const fetchUsers = async () => {
    try {
      setLoading(true);
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
      console.log(res.data)
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [page, ModalShow, filters]);

  const getAllApartmentCities = async () => {
    const res = await axios.get(`${baseURL}OnwerParmters/city`)
    setcitiesOptions(res.data)
  }

  useEffect(() => {
    getAllApartmentCities()
  }, [ModalShow])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <div>
    
      <FilterableTable citiesOptions={citiesOptions} users={loading ? [] : users} filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="pagination">
            <button onClick={nextPage} disabled={page === totalPages}>← הבא</button>
            <span className="pagination-span" style={{ margin: '0 10px', color: '#231f20' }}>עמוד {page} מתוך {totalPages}</span>
            <button onClick={prevPage} disabled={page === 1}>הקודם →</button>
          </div>
          <DonationBox />
        </>
      )}
    </div>
  );
};

export default HeadPage;
