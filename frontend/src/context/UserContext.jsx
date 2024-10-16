// import React, { createContext, useState, useEffect } from "react"

// export const UserContext = createContext();

// export const UserProvider = (props) => {
//     const [token,setToken]= useState(localStorage.getItem(accessToken));

//     useEffect(()=>{
//         const fetchUser = async ()=> {
//             const requestOptions = {
//                 method : "GET",
//                 headers: {
//                     "Content-Type" : "application/json",
//                     Authorization: "Bearer " + token,
//                 },
//             };

//             const response = await fetch("/api/users/me",requestOptions);

//             if (!response.ok){
//                 setToken(null);
    
//             }
//             localStorage.setItem("accessToken", token)
//         };
//         fetchUser();
//     }, [token]);

//     return (
//         <UserContext.Provider value={[token.setToken]}>
//             {props.children}
//         </UserContext.Provider>
//     )

//  };


 // AuthContext.js
// AuthContext.js
import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  //const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
