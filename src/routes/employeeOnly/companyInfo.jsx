import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployeePage from './addEmployee';
import { useAuth } from '../../context/authContext';
import axios from 'axios';

//import ReportsPage from './reportsPage';

const EmployeeDashboardPage = () => {

    const { loggedIn, userId, userRole, loading } = useAuth();

    const navigate = useNavigate();


    const [employeeList, setEmployeeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);




    useEffect(() => { // change to a
        if (!loading && loggedIn) {
            const verifited = userRole === 'e' || userRole === 'a';
            if (!verifited) {
                navigate('/');
            }
        }
    }, [loggedIn, userRole, loading]);


    useEffect(() => {
        if (!loading && loggedIn) {
            const fetchEmployees = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/employees/get_employees`);
                    setEmployeeList(res.data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchEmployees();
        }
    }, [loggedIn, loading, userId]);


    useEffect(() => {
        if (!loading && loggedIn) {
            const fetchDepartments = async () => {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/departments/get_departments`);
                    setDepartmentList(res.data);
                    console.log(departmentList);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchDepartments();
        }
    }, [loggedIn, loading, userId]);

    return (
        <div>
            <h1>Company Info</h1>

            <h2>Employees</h2>
            <ul>
                {employeeList.length > 0 ? (
                    employeeList.map(employee => (
                    <li key={employee.employee_id}>{employee.employee_firstname} {employee.employee_lastname} - {employee.department_name}</li>
                ))
                ) : (
                    <p>No employees found</p>
                )}
            </ul>

            <h2>Departments</h2>
            <ul>
                {departmentList.length > 0 ? (
                    departmentList.map(department => (
                    <li key={department.department_id}>{department.department_name} - Managed by: {department.department_manager_name}</li>
                ))
                ) : (
                    <p>No departments found</p>
                )}
            </ul>

        </div>
        

    );
};

export default EmployeeDashboardPage;