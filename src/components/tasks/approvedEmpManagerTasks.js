import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css'

function Approved() {
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));
    const [rejectedTasks, setRejectedTasks] = useState([]);
    const [needToUpdate, setNeedToUpdate] = useState('')
    const [captureClickedTaskId, setCaptureClickedTaskId] = useState('');

    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if (jwt === null) {
            navigate('/login')
            //window.location.reload(true);
        }
    }, []);

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
        }
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8001/approvedEmpTasks?empId=${loggedinUser.id}&role=${loggedinUser.role.roleName}`)
            .then((response) => {
                const fdata = response.data.data;
                setRejectedTasks(fdata);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const capturedId = captureClickedTaskId.captureClickedTaskId;
    return (
        <div style={{ backgroundColor: "#1C2340" }}>
            <div className="Eheader">
                <div className="Home" onClick={() => { navigate('/viewTasks') }}>Home</div>
                <div className="ApprovePageRejectName" onClick={() => { navigate('/rejectedTasks') }}>Rejected Tasks</div>
                <div className="logedUserName">{loggedinUser?.name}</div>
                <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
                <div className="projName">{loggedinUser.project.projName}</div>
                <div className="logout" onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</div>
            </div>
            <div className="ViewTasksMainDiv">
                <div className="viewTasksDiv">
                    <p style={{ color: "yellow", fontSize: "20px" }}>Approved Tasks</p>
                    <table style={{marginLeft:"200px"}}>
                        <thead style={{ fontSize: "18px" }}>
                            <tr>
                                <th className="tableHead">Task</th>
                                <th className="tableHead">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rejectedTasks && rejectedTasks.map((task, i) => {
                                return (
                                    <tr className="Row">
                                        <td className="tableData">{task.tasks}</td>
                                        <td className="tableData">{task.date}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Approved;