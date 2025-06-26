import React, { useContext, useState, useEffect } from 'react'
import Header from '../../others/Header'
import TaskListNumber from '../../others/TaskListNumber'
import TaskList from '../TaskList/TaskList'
import { AuthContext } from '../../context/AuthProvider'

const EmployeeDashboard = (props) => {
  const { userData, setUserData } = useContext(AuthContext);
  const [currentEmployeeData, setCurrentEmployeeData] = useState(props.data);

  // Update current employee data when props.data changes
  useEffect(() => {
    setCurrentEmployeeData(props.data);
  }, [props.data]);

  const handleTaskUpdate = (task, action) => {
    if (!userData || !currentEmployeeData) return;

    // Find the current employee in the userData
    const employeeIndex = userData.employees.findIndex(emp => emp.id === currentEmployeeData.id);
    if (employeeIndex === -1) return;

    // Create a copy of the current employee
    const updatedEmployee = { ...userData.employees[employeeIndex] };
    
    // Find the task in the employee's tasks
    const taskIndex = updatedEmployee.tasks.findIndex(t => 
      t.taskTitle === task.taskTitle && 
      t.taskDate === task.taskDate && 
      t.category === task.category
    );
    
    if (taskIndex === -1) return;

    // Update the task based on the action
    const updatedTask = { ...updatedEmployee.tasks[taskIndex] };
    const oldTaskCounts = { ...updatedEmployee.taskCounts };

    switch (action) {
      case 'accept':
        // Move from new to active
        if (updatedTask.newTask) {
          updatedTask.newTask = false;
          updatedTask.active = true;
          updatedEmployee.taskCounts.newTask = Math.max(0, oldTaskCounts.newTask - 1);
          updatedEmployee.taskCounts.active = oldTaskCounts.active + 1;
        }
        break;
        
      case 'complete':
        // Move from active to completed
        if (updatedTask.active) {
          updatedTask.active = false;
          updatedTask.completed = true;
          updatedEmployee.taskCounts.active = Math.max(0, oldTaskCounts.active - 1);
          updatedEmployee.taskCounts.completed = oldTaskCounts.completed + 1;
        }
        break;
        
      case 'fail':
        // Move from active to failed
        if (updatedTask.active) {
          updatedTask.active = false;
          updatedTask.failed = true;
          updatedEmployee.taskCounts.active = Math.max(0, oldTaskCounts.active - 1);
          updatedEmployee.taskCounts.failed = oldTaskCounts.failed + 1;
        }
        break;
        
      default:
        return;
    }

    // Update the task in the employee's tasks array
    updatedEmployee.tasks[taskIndex] = updatedTask;

    // Update the userData with the modified employee
    const updatedEmployees = [...userData.employees];
    updatedEmployees[employeeIndex] = updatedEmployee;
    
    const updatedUserData = { ...userData, employees: updatedEmployees };

    // Update the context
    setUserData(updatedUserData);
    
    // Update local state
    setCurrentEmployeeData(updatedEmployee);
    
    // Update localStorage
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    // Update the logged in user data in localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser.role === 'employee') {
      loggedInUser.data = updatedEmployee;
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
    }
  };

  return (
    <div className='p-10 bg-[#1C1C1C] h-screen'>
      <Header changeUser={props.changeUser} data={currentEmployeeData} />
      <TaskListNumber data={currentEmployeeData} />
      <TaskList data={currentEmployeeData} onTaskUpdate={handleTaskUpdate} />
    </div>
  )
}

export default EmployeeDashboard