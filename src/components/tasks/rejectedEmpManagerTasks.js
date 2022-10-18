import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Rejected() {
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const Role = loggedinUser.role.roleName;
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));
    const [rejectedTasks, setRejectedTasks] = useState([]);
    const [edit, setEdit] = useState(false);
    const [needToUpdate, setNeedToUpdate] = useState('');
    const [captureClickedTaskId, setCaptureClickedTaskId] = useState('');
    const [managerName, setManagerName] = useState('');
    const [task, setTask] = useState({
        textArea: ''
    });
    const updateThis = needToUpdate.needToUpdate;
    const textAreaHandler = event => {
        setTask({
            [event.target.name]: event.target.value
        })
    }

    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if (jwt === null) {
            navigate('/login')
            //window.location.reload(true);
        }
    }, []);

    async function rejectedEmpORManagerTasks(id, Role) {
        axios.get(`http://localhost:8001/rejectedEmpTasks?empId=${id}&role=${Role}`)
            .then((response) => {
                const fdata = response.data.data;
                setRejectedTasks(fdata);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        const gdoId = loggedinUser.gdoId;
        axios.get(`http://localhost:8001/managerOfemp?gdoId=${gdoId}`)
            .then((response) => {
                var ManagerNameResponse = response.data;
                const nameOfManager = ManagerNameResponse.data.name;
                setManagerName(nameOfManager);
            })
            .catch((error) => {
                console.log(error);
            })

        rejectedEmpORManagerTasks(loggedinUser.id, Role);
    }, [])

    const capturedId = captureClickedTaskId.captureClickedTaskId;
    const handleUpdate = event => {
        event.preventDefault();
        axios.put(`http://localhost:8001/updateTask?taskId=${capturedId}`, {
            tasks: event.target.textArea.value
        })
            .then((res) => {
                console.log(res);
                if (res.data.success) {
                    rejectedEmpORManagerTasks(loggedinUser.id, Role);
                    setEdit(false);
                    toast.success(`${res.data.message}`);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <div style={{ backgroundColor: "#1C2340" }}>
            <div className="Eheader">
                <div className="Home" onClick={() => { navigate('/viewTasks') }}>Home</div>
                <div className="RejectPageApproveName" onClick={() => { navigate('/approvedTasks') }}>Approved Tasks</div>
                <div className="logedUserName">{loggedinUser?.name}</div>
                <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
                <div className="projName">{loggedinUser.project.projName}</div>
                <div className="logout" onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</div>
            </div>
            <div className="ViewTasksMainDiv">
                <div className="viewTasksDiv">
                    <p style={{ textAlign: "center", color: "red" ,fontSize:"24px"}}>Rejected Tasks</p>
                    <table>
                        <thead>
                            <tr>
                                <th className="tableHead">Task</th>
                                <th className="tableHead">Date</th>
                                <th className="tableHead">Rejected By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rejectedTasks && rejectedTasks.map((task, i) => {
                                let stat;
                                if (task.Mstatus === "Rejected") {
                                    stat = `${managerName}`
                                }
                                else if (task.Astatus === "Rejected") {
                                    stat = "Srinivas"
                                }
                                const handleEdit = event => {
                                    setEdit(true);
                                    var clickedTask = task.tasks;
                                    setNeedToUpdate({
                                        needToUpdate: clickedTask
                                    })
                                    setCaptureClickedTaskId({
                                        captureClickedTaskId: task.id
                                    })
                                }
                                const onChangeEdit = event => {
                                    [event.target.name] = event.target.value
                                }
                                return (
                                    <tr className="Row">
                                        <td className="tableData">{task.tasks}</td>
                                        <td className="tableData">{task.date}</td>
                                        <td className="tableData">{stat}</td>
                                        <tr>
                                            <button className="Edit" onClick={handleEdit} onChange={onChangeEdit}>Edit</button>
                                        </tr>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {edit ? <div>
            <form onSubmit={handleUpdate}>
                <textarea className="textAreaDiv"
                    placeholder="Update your task"
                    rows="2"
                    cols="40"
                    name="textArea"
                    required="true"
                    type="text"
                    onChange={textAreaHandler}
                >
                    {needToUpdate.needToUpdate}
                </textarea>
                <button type="submit" className="AddUpdateButton">Update</button>
            </form>
        </div>:<></>}
            <ToastContainer autoClose={500} />
        </div>
    );
}

export default Rejected;