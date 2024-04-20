import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployeePage from './addEmployee';
import AddDepartmentPage from './addDepartment';
import { useAuth } from '../../context/authContext';
import CompanyInfoPage from './companyInfo';
//import ReportsPage from './reportsPage';
import {Container, Button} from '@mui/material';

const EmployeeDashboardPage = () => {



    const { loggedIn, userId, userRole, loading } = useAuth();

    const navigate = useNavigate();


    const [showAddEmployee, setShowAddEmployee] = useState(false);
    const [showAddDepartment, setShowAddDepartment] = useState(false);




    const handleShowAddEmployee = () => {
        setShowAddEmployee(true);
        setShowAddDepartment(false);

        if (showAddEmployee) {
            setShowAddEmployee(false);
        }
    };

    const handleShowAddDepartment = () => {
        setShowAddDepartment(true);
        setShowAddEmployee(false);

        if (showAddDepartment) {
            setShowAddDepartment(false);
        }
    }

    const handleClose = () => {
        setShowAddEmployee(false);
        setShowAddDepartment(false);
    };



    useEffect(() => {
        if (!loading && loggedIn) {
            const verifited = userRole === 'e' || userRole === 'x';
            if (!verifited) {
                navigate('/');
            }
        }
    }, [loggedIn, userRole, loading]);

    useEffect(() => {
        if (!loading && loggedIn) {

        }
    }, [loggedIn, loading]);

    return (
        <div>  
            <h1>Employee Dashboard</h1>
            <CompanyInfoPage/>
            <Container>
            <Button variant="contained" color="primary" onClick={handleShowAddEmployee}>Add Employee</Button>
            <Button  variant="contained" color="primary" onClick={handleShowAddDepartment}>Add Department</Button>
            </Container>
            {showAddDepartment && <AddDepartmentPage close={handleClose} />}
            {showAddEmployee && <AddEmployeePage close={handleClose} />}
            
            {!showAddDepartment && !showAddEmployee && (
                <div>
                    <h2>No add item selected</h2>
                </div>
            )}
        </div>
        

    );
};

export default EmployeeDashboardPage;