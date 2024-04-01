import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Delete, Edit } from "@mui/icons-material";
import "./main.css";
import Dialog from "@mui/material/Dialog";
import EmployeeForm from "../Modals/EmployeeForm";
import Swal from 'sweetalert2';
import api from "../../utils/axios";
import Salary from "../Modals/Salary";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [Updated, setUpdated] = useState(false)
  const [open, setOpen] = useState(false);
  const [salaryModal, setSalaryModal] = useState(false)
  const [selectedEmp, setSelectedEmp] = useState(null)
  const navigate = useNavigate();

  const getEmployees = async () => {
    try {
      const res = await api.get("/employee/all");
      setEmployees(res?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedEmployee(null)
    setOpen(false);
  };
  const handleEditEmp = (emp) => {
    setSelectedEmployee(emp)
    setOpen(true)
  }

  const deleteHandler = (empName, empId) => {
    Swal.fire({
      title: `Do you want to delete ${empName}?`,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await api.delete(`/employee/${empId}`,)
        Swal.fire(res.data.message, "", res?.data?.status ? "success" : "error");
        if (res.data.status) setUpdated(!Updated)
      }
    });
  }

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme?.breakpoints.down('md'));


  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    getEmployees();
  }, [Updated]);



  return (
    <div className="main-container">
      <div className="add-emp">
        <button className="btn" onClick={handleClickOpen}>ADD EMPLOYEE</button>
      </div>
      {employees?.length ? <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#3bb19b" }}>
            <TableRow>
              <TableCell>E-ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Phone</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees?.map((emp) => (
              <TableRow
                key={emp?.empIdNumber}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{emp?.empIdNumber}</TableCell>
                <TableCell component="th" scope="row"> {emp?.name}</TableCell>
                <TableCell align="right">{emp?.mobile}</TableCell>
                <TableCell align="right">{emp?.email}</TableCell>
                <TableCell align="right">{emp?.jobPosition}</TableCell>
                <TableCell align="right actions">
                  <Edit className="pointer mui-icon" onClick={() => { handleEditEmp(emp) }} />
                  <Delete className="pointer mui-icon" onClick={() => deleteHandler(emp.name, emp._id)} />
                  <button className="add-salary-btn" onClick={() => { setSalaryModal(true); setSelectedEmp(emp) }}>Add Salary</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> :
        <><div className="no-content">Please Add Employees to Show</div></>
      }

      <Dialog open={open} onClose={() => setOpen(false)} >
        <EmployeeForm handleClose={handleClose} selectedEmployee={selectedEmployee} setOpen={setOpen} setUpdated={setUpdated} />
      </Dialog>

      <Dialog open={salaryModal} aria-labelledby="responsive-dialog-title" fullScreen={fullScreen}  >

        <Salary selectedEmp={selectedEmp} setSalaryModal={setSalaryModal} />

      </Dialog>
    </div >
  );
};

export default Main;
