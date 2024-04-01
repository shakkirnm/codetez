import React from "react"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import "./salary.css"
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Delete, Edit, TitleOutlined } from "@mui/icons-material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { months } from "../../utils/constants";
import api from "../../utils/axios";
import Swal from 'sweetalert2';
import { useEffect } from "react";

function Salary({ selectedEmp, setSalaryModal }) {
    const [addSalary, setAddSalary] = useState(false)
    const [salaries, setSalaries] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [updated, setUpdated] = useState(false)
    const [data, setData] = useState({
        salaryPerDay: "",
        month: "",
        workingDays: "",
        year: ""
    })
    const handleChange = (e) => {
        if (errorMessage) setErrorMessage("")
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleSubmit = async () => {
        try {
            const { salaryPerDay, month, workingDays, year } = data
            if (!salaryPerDay || salaryPerDay <= 0) {
                return setErrorMessage("Please Check the Salary Per Day")
            }
            if (!month) {
                return setErrorMessage("Please Check the month")
            }
            if (!workingDays || workingDays < 0) {
                return setErrorMessage("Please Check the Working Days")
            }
            if (!year || year < 1990 || year > 3000) {
                return setErrorMessage("Please Check the Year")
            }
            const reqData = {
                empId: selectedEmp._id,
                ...data,
            }
            const res = await api.post("/employee/salary", reqData)
            Swal.fire({
                text: res?.data?.message,
                icon: res?.data?.status ? 'success' : "error",
                confirmButtonText: 'Close',
                position: "top-right",
                timer: 2000,
            });
            setUpdated(!updated)
        } catch (error) {
            Swal.fire({
                text: error?.message,
                icon: "error",
                confirmButtonText: 'Close',
                position: "top-right",
                timer: 2000,
            });
            return setErrorMessage(error?.data?.message)
        }
    }


    const getSalaries = async () => {
        try {
            const res = await api.get(`/employee/salary/${selectedEmp._id}`)
            setSalaries(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }
    const deleteHandler = async (_id) => {
        Swal.fire({
            title: `Do you want to delete salary?`,
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await api.delete(`/employee/salary/${_id}`)
                Swal.fire({
                    text: res.data.message,
                    icon: res?.data?.status ? "success" : "error",
                    confirmButtonText: 'Close',
                    position: "top-right",
                    timer: 2000,
                });
            }
        });
    }
    useEffect(() => {
        getSalaries()
    }, [updated])

    return (
        <div className="add-salary">
            <DialogTitle>Salaries</DialogTitle>
            <div className="add-btn">
                <Button variant="outlined" sx={{ marginBottom: "0.5rem" }} className="pointer" onClick={() => setAddSalary(!addSalary)}>Add Salary</Button>
            </div>
            {addSalary && <DialogContent dividers>
                <DialogContent>
                    <div className="form-container">
                        <TextField
                            required
                            margin="dense"
                            id="name"
                            name="salaryPerDay"
                            label="Salary Per Day"
                            type="number"
                            variant="standard"
                            min={1}
                            value={data.salaryPerDay}
                            onChange={handleChange}

                        />
                        <TextField
                            required
                            margin="dense"
                            id="name"
                            name="workingDays"
                            label="Working Days"
                            type="Number"
                            variant="standard"
                            min={0}
                            value={data.workingDays}
                            onChange={handleChange}
                        />
                    </div >
                    <div className="form-container">
                        <FormControl variant="standard" sx={{ width: "40%" }}>
                            <InputLabel id="demo-simple-select-standard-label">Month</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={data.month}
                                onChange={handleChange}
                                label="Month"
                                name="month"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {months.map((month) => (
                                    <MenuItem value={month}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            required
                            margin="dense"
                            id="name"
                            name="year"
                            label="Year"
                            type="Number"
                            variant="standard"
                            value={data.year}
                            onChange={handleChange}

                        />
                    </div>
                </DialogContent>
                {errorMessage && <div className="err-msg">
                    <span>{errorMessage}</span>
                </div>}
                <div className="add-new-salary">
                    <button className="btn" onClick={handleSubmit}>Add Salary</button>
                </div>
            </DialogContent>}
            <DialogContent>
                {salaries?.length ? <TableContainer component={Paper}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: "#3bb19b" }}>
                            <TableRow>
                                <TableCell>Sl.No</TableCell>
                                <TableCell>Year </TableCell>
                                <TableCell>Month </TableCell>
                                <TableCell align="right">Salary Per Day</TableCell>
                                <TableCell align="right">Working Days</TableCell>
                                <TableCell align="right">Total Salary</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salaries?.map((item, index) => (
                                <TableRow
                                    key={item._id}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell align="right"> {item?.year} </TableCell>
                                    <TableCell align="right"> {item?.month} </TableCell>
                                    <TableCell align="right">{item?.salaryPerDay}</TableCell>
                                    <TableCell align="right">{item?.workingDays}</TableCell>
                                    <TableCell align="right">{item?.workingDays * item?.salaryPerDay}</TableCell>
                                    <TableCell align="right actions">
                                        <Edit className="pointer mui-icon" onClick={() => { }} />
                                        <Delete className="pointer mui-icon" onClick={() => { setSalaryModal(false); deleteHandler(item?._id) }} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> :
                    <><div className="no-content">Please Add Salaries to Show</div></>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSalaryModal((pre) => !pre)}>Close</Button>
            </DialogActions>
        </div>
    )
}

export default Salary