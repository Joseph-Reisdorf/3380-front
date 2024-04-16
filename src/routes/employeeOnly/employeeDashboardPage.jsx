import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployeePage from './addEmployee';
import AddDepartmentPage from './addDepartment';
import { useAuth } from '../../context/authContext';
//import ReportsPage from './reportsPage';

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
            const verifited = userRole === 'e' || userRole === 'a';
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
            <button onClick={handleShowAddEmployee}>Add Employee</button>
            <button onClick={handleShowAddDepartment}>Add Department</button>
            {showAddDepartment && <AddDepartmentPage close={handleClose} />}
            {showAddEmployee && <AddEmployeePage close={handleClose} />}
        </div>
        

    );
};

export default EmployeeDashboardPage;