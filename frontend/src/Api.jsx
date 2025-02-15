import axios from 'axios'

const api = axios.create({
    baseURL: "https://hotelbackend-production-9806.up.railway.app",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
export default api