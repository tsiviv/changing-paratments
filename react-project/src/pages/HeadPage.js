import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterableTable from './Tables';
import { useSelector } from 'react-redux';
const HeadPage = () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
  });
  const ModalShow = useSelector((state) => state.user.ModalShow); // השתמש ברידוסר הנכון
  const [users, setuser] = useState()
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axiosInstance.get('/users')
      console.log(res.data)
      setuser(res.data)

    }
    fetchUsers()
  }, [ModalShow])
  return (
    <div>
      <FilterableTable users={users}/>
    </div>
  );
};

export default HeadPage;
