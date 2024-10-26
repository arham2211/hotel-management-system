import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);



  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole,userId,setUserId}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
