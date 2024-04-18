import { React , useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AddEmployeePage from './addEmployee';
import { useAuth } from '../../context/authContext';
import axios from 'axios';
import '../../styles/CompanyInfoPage.css';
import { Typography } from '@mui/material';
import EmployeeTablePage from './employeeTablePage';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TableSortLabel } from '@mui/material';

const DepartmentsTable = ({ departments }) => {


    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('employee_id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

   


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page with new rows per page
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

    console.log(departments);
    return (
        <Paper style={{ maxHeight: 440, overflow: 'auto' }}>
            <TableContainer className='table-container'>
                <Table aria-label="department table" size="small">
                    <TableHead>
                        <TableRow className="table-header">
                            <TableCell className="table-cell">
                                Department
                            </TableCell>
                            <TableCell className="table-cell">
                                Manager
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments.length > 0 ? stableSort(departments, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((department) => (
                                
                                <TableRow className="table-row" key={department.department_id}>
                                    <TableCell className="table-cell">{department.department_name}</TableCell>
                                    <TableCell className="table-cell">{department.department_manager_name}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={2} className="table-cell">No departments found</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={departments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default DepartmentsTable;