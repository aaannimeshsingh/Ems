import React, { useContext, useEffect} from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { getLocalStorage } from './utils/localStorage'
import { setLocalStorage } from './utils/localStorage'
import { useState } from 'react'
import { AuthContext } from './context/AuthProvider'

function App() {
  localStorage.clear()
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const authData = useContext(AuthContext)

  useEffect(() => {
    if (authData) {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        setUser(userData.role); // Fix: Use userData.role, not loggedInUser.role
        
        // If it's an employee, get the current employee data
        if (userData.role === 'employee' && userData.data) {
          // Get updated employee data from context to reflect any changes
          const currentEmployee = authData.userData?.employees?.find(
            emp => emp.id === userData.data.id
          );
          setLoggedInUserData(currentEmployee || userData.data);
        }
      }
    }
  }, [authData])
  
  const handleLogin = (email, password) => {
    if (email === 'admin@me.com' && password === '123') {
      setUser('admin');
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }));
    } else if (authData) {
      const employee = authData.userData?.employees?.find((e) => email === e.email && password === e.password);

      if (employee) {
        setUser('employee');
        setLoggedInUserData(employee);
        // Fix: Store employee data along with role
        localStorage.setItem('loggedInUser', JSON.stringify({ 
          role: 'employee', 
          data: employee 
        }));
      } else {
        alert("Invalid Credentials");
      }
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user === 'admin' ? 
        <AdminDashboard changeUser={setUser} /> : 
        user === 'employee' ? 
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} /> : 
        null
      }
    </>
  )
}

export default App