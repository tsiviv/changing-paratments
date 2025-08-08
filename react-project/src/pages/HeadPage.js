import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterableTable from './Tables';
import { useSelector } from 'react-redux';
import config from '../config';
const HeadPage = () => {
  const axiosInstance = axios.create({
    baseURL: config.baseUrl,
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
