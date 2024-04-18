import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployeePage from './addEmployee';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import '../../styles/CompanyInfoPage.css';
import { Typography } from '@mui/material';
import EmployeeTablePage from './employeeTablePage';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TableSortLabel } from '@mui/material';
import DepartmentsTablePage from './departmentTablePage';
//import ReportsPage from './reportsPage';





const CompanyInfoPage = () => {

    const { loggedIn, userId, userRole, loading } = useAuth();

    const navigate = useNavigate();


    const [employeeList, setEmployeeList] = useState([]);
    const [departmentList, setDepartmentList] = useState([]);






    useEffect(() => { // change to a
        if (!loading && loggedIn) {
            const verifited = userRole === 'e' || userRole === 'x';
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

            console.log(employeeList);
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
            console.log(departmentList);
        }
    }, [loggedIn, loading, userId]);

    return (
        <div className='admin-dashboard-container'>
            {/* Using Typography for the main heading */}
            <Typography variant="h2" component="h2" gutterBottom>
                Company Info
            </Typography>

            <div className='report-container'>
                {/* Using Typography for subsection heading */}
                <Typography variant="h3" component="h3" gutterBottom>
                    Employees
                </Typography>
                {employeeList.length > 0 ? 
                    <EmployeeTablePage employees={employeeList} /> : 
                    <Typography variant="body2">No employees found</Typography>
                }
            </div>

            <div className='report-container'>
                {/* Using Typography for another subsection heading */}
                <Typography variant="h3" component="h3" gutterBottom>
                    Departments
                </Typography>
                {departmentList.length > 0 ? 
                    <DepartmentsTablePage departments={departmentList} /> : 
                    <Typography variant="body2">No departments found</Typography>
                }
                { console.log(departmentList)}
            </div>
        </div>
        

    );
};

export default CompanyInfoPage;