import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HeadPage = () => {
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
  });

  return (
    <div>
        
    </div>
  );
};

export default HeadPage;
