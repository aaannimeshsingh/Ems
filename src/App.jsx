import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

function App() {
  // Remove localStorage.clear() - this was causing issues
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const authData = useContext(AuthContext)

  useEffect(() => {
    if (authData) {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        setUser(userData.role);
        
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
    // Fixed admin credentials to match your localStorage data
    if (email === 'admin@example.com' && password === '123') {
      setUser('admin');
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin' }));
    } else if (authData) {
      const employee = authData.userData?.employees?.find((e) => email === e.email && password === e.password);
      if (employee) {
        setUser('employee');
        setLoggedInUserData(employee);
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
