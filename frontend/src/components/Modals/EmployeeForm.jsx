import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import Swal from 'sweetalert2';
import { CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import api from "../../utils/axios";

function EmployeeForm({ handleClose, selectedEmployee, setOpen, setUpdated }) {
  const [loading, setLoading] = useState(false)
  const [employeeData, setEmployeeData] = useState({
    name: selectedEmployee ? selectedEmployee?.name : "",
    mobile: selectedEmployee ? selectedEmployee?.mobile : "",
    email: selectedEmployee ? selectedEmployee?.email : "",
    address: selectedEmployee ? selectedEmployee?.address : "",
    emergencyContact: selectedEmployee ? selectedEmployee?.emergencyContact : "",
    department: selectedEmployee ? selectedEmployee?.department : "",
    jobPosition: selectedEmployee ? selectedEmployee?.jobPosition : "",
    joiningDate: selectedEmployee ? selectedEmployee?.joiningDate?.substring(0, 10) : "",
  })
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errorMessage) setErrorMessage("")
    setEmployeeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const addEmployee = async () => {
    try {
      setLoading(true)
      const res = await api.post("/employee", employeeData);
      if (!res.data.status) setErrorMessage(res?.data?.message)
      if (res.data.status) {
        handleClose()
        Swal.fire({
          text: res?.data?.message,
          icon: res.data.status ? 'success' : 'error',
          confirmButtonText: 'Close',
          position: "center",
          timer: 2000,
        });
        setUpdated((pre) => !pre)
      }
    } catch (error) {
      Swal.fire({
        text: error?.data?.message,
        icon: 'success',
        confirmButtonText: 'Close',
        position: "top-right",
        timer: 2000,
      });
    } finally {
      setLoading(false)
    }
  }

  const editEmployee = async () => {
    try {
      setLoading(true)
      employeeData._id = selectedEmployee._id
      const res = await api.patch("/employee", employeeData);
      if (!res.data.status) setErrorMessage(res?.data?.message)
      if (res.data.status) {
        handleClose()
        Swal.fire({
          text: res?.data?.message,
          icon: res.data.status ? 'success' : 'error',
          confirmButtonText: 'Close',
          position: "center",
          timer: 2000,
        });
        setUpdated((pre) => !pre)
      }
    } catch (error) {
      setOpen(false)
      Swal.fire({
        text: error?.data?.message,
        icon: 'error',
        confirmButtonText: 'Close',
        position: "top-right",
        timer: 2000,
      });
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedEmployee) {
      return addEmployee()
    } else {
      return editEmployee()
    }
  }

  const handleCloseButton = () => {
    if (!loading) handleClose()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-head">
          <DialogTitle>{selectedEmployee ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <div className="close">
            <Close disabled={!loading} onClick={handleCloseButton} />
          </div>
        </div>
        {errorMessage && <div className="err-msg">
          <span>{errorMessage}</span>
        </div>}
        <DialogContent>
          <TextField
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={employeeData.name}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={employeeData.email}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="phone"
            name="mobile"
            label="Phone Number"
            type="number"
            fullWidth
            variant="standard"
            value={employeeData.mobile}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="Address"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={employeeData.address}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="emergency"
            name="emergencyContact"
            label="Emergency Contact Number"
            type="number"
            fullWidth
            variant="standard"
            value={employeeData.emergencyContact}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="department"
            name="department"
            label="Department "
            type="text"
            fullWidth
            variant="standard"
            value={employeeData.department}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="role"
            name="jobPosition"
            label="Job Role"
            type="text"
            fullWidth
            variant="standard"
            value={employeeData.jobPosition}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            id="role"
            name="joiningDate"
            label="Joining Date"
            type="date"
            fullWidth
            variant="standard"
            value={employeeData.joiningDate}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          {loading ? <CircularProgress size={30} color="success" /> : <Button type="submit" disabled={loading} >{selectedEmployee ? "Edit" : "Add"}</Button>}
        </DialogActions>
      </form>

    </>
  );
}

export default EmployeeForm;
