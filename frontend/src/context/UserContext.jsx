import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(null);
  // const [token, setToken] = useState(null);


  return (
    <AuthContext.Provider value={{ token, setToken, role, setRole}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
