import React, { createContext, useEffect, useState } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils/localStorage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        // Initialize localStorage with default data if not exists
        const existingData = getLocalStorage();
        if (!existingData.employees || !existingData.admin) {
            setLocalStorage();
        }
        
        // Get the data (either existing or newly set)
        const { employees, admin } = getLocalStorage();
        setUserData({ employees, admin });
    }, []);

    return (
        <AuthContext.Provider value={{ userData, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;