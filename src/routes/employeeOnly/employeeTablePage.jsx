import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployeePage from './addEmployee';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import '../../styles/CompanyInfoPage.css';
import { Typography } from '@mui/material';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TableSortLabel } from '@mui/material';

//import ReportsPage from './reportsPage';

const EmployeesTable = ({ employees }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('employee_id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

   

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        console.log("Sorting property:", property, "Current order:", order, "Is ascending:", isAsc);
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        console.log('Changing to page:', newPage); // Debug: Check if this gets logged in the console when attempting to change pages
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        console.log('Changing rows per page to:', event.target.value); // Debug: Check if this gets logged when changing rows per page
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    };

    return (
        <Paper  >
            <TableContainer className='table-container'>
            <Table aria-label="simple table" size="small">
                <TableHead>
                    <TableRow className="table-header">
                        <TableCell className="table-cell" sortDirection={orderBy === 'employee_id' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'employee_id'}
                                direction={orderBy === 'employee_id' ? order : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'employee_id')}
                            >
                                Employee ID
                            </TableSortLabel>
                        </TableCell>
                        <TableCell className="table-cell">First Name</TableCell>
                        <TableCell className="table-cell">Last Name</TableCell>
                        <TableCell className="table-cell">Department</TableCell>
                        <TableCell className="table-cell">Role</TableCell>
                        <TableCell className="table-cell">Hire Date</TableCell>
                        <TableCell className="table-cell" sortDirection={orderBy === 'employee_salary' ? order : false}>
                            <TableSortLabel
                                active={orderBy === 'employee_salary'}
                                direction={orderBy === 'employee_salary' ? order : 'asc'}
                                onClick={(event) => handleRequestSort(event, 'employee_salary')}
                            >
                                Salary
                            </TableSortLabel>
                        </TableCell>
                        <TableCell className="table-cell">Manager</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.length > 0 ? stableSort(employees, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((employee) => (
                            <TableRow className="table-row" key={employee.employee_id}>
                                <TableCell className="table-cell">{employee.employee_id}</TableCell>
                                <TableCell className="table-cell">{employee.employee_firstname}</TableCell>
                                <TableCell className="table-cell">{employee.employee_lastname}</TableCell>
                                <TableCell className="table-cell">{employee.department_name}</TableCell>
                                <TableCell className="table-cell">{employee.employee_role}</TableCell>
                                <TableCell className="table-cell">{employee.employee_hire_date.slice(0,10)}</TableCell>
                                <TableCell className="table-cell">{employee.employee_salary}</TableCell>
                                <TableCell className="table-cell">{employee.manager_name}</TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={8} className="table-cell">No employees found</TableCell></TableRow>}
                </TableBody>
            </Table>
            </TableContainer>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={employees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}  // This should be firing on clicking pagination buttons
            onRowsPerPageChange={handleChangeRowsPerPage}  // This should fire on changing the number per page
        />
        </Paper>
    );
};

export default EmployeesTable;