import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManagerUnderAdmin() {
    const navigate = useNavigate();
    const [AllManagers, setAllManagers] = useState([]);
    const [EmpsUnderManager, setEmpsUnderManager] = useState([]);
    const [showEmpDiv, setShowEmpDiv] = useState(false);
    const [clickedManagerName, setClickedManagerName] = useState('');
    const [managerTasks, setManagerTasks] = useState([]);
    const [empTasksPendingAtAdmin, setEmpTasksPendingAtAdmin] = useState([]);
    const [showManagerTasks, setShowManagerTasks] = useState(true);
    const [showEmpTasks, setShowEmpTasks] = useState(false);
    const [clickedEmpName, setClickedEmpName] = useState('');
    const [stateManagerId, setGetManagerId] = useState('');
    const [stateEmpId, setGetEmpId] = useState('');
    const [stateRole, setGetRole] = useState('');
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));

    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if (jwt === null) {
            navigate('/login')
        }
    }, [jwt]);

    useEffect(() => {
        axios.get('http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/allManagers')
            .then((response) => {
                const resdata = response.data;
                setAllManagers(resdata.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, []);

    async function handleManagerTasksOutside(getManagerId) {
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/managerPendingTasksAtAdmin?managerId=${getManagerId}`)
            .then((response) => {
                const resdata = response.data;
                setManagerTasks(resdata.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    async function handleEmpNameOutside(empId, getRole) {
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/empPendingTasksAtManagerOrAdmin?empId=${empId}&role=${getRole}`)
            .then((response) => {
                const resdata = response.data;
                setEmpTasksPendingAtAdmin(resdata.data);
                setShowManagerTasks(false);
                setShowEmpTasks(true);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <div style={{ backgroundColor: "#040e24"}}>
            <div className="Eheader">
                <div className="Home" onClick={() => { navigate('/viewTasks') }}>Home</div>
                <div className="logedUserName">{loggedinUser?.name}</div>
                <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
                <div className="projName">{loggedinUser.project.projName}</div>
                <div className="logout" onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</div>
            </div>
            <div className="ManagerEmpsMaindiv">
                <div className="ManagerList">
                    <table>
                        <thead>
                            <tr>
                                <th className="tableHead">Name</th>
                                <th className="tableHead">Project</th>
                                <th className="tableHead">Gdo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AllManagers && AllManagers.map((manager, i) => {
                                const handleManagerName = event => {
                                    setShowEmpDiv(true);
                                    setShowManagerTasks(true);
                                    setShowEmpTasks(false);
                                    setClickedManagerName(manager.name)
                                    const getGdoId = manager.gdo.id;
                                    axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/managerEmps?gdoId=${getGdoId}`)
                                        .then((res) => {
                                            setEmpsUnderManager(res.data.data);
                                        })
                                        .catch((error) => {
                                            console.log(error)
                                        })

                                    const getManagerId = manager.id;
                                    setGetManagerId(getManagerId);
                                    handleManagerTasksOutside(getManagerId);
                                }
                                return (
                                    <tr className="Row">
                                        <td className="tableData" onClick={handleManagerName} style={{ cursor: "pointer" }}>{manager.name}</td>
                                        <td className="tableData" onClick={handleManagerName} style={{ cursor: "pointer" }}>{manager.project.projName}</td>
                                        <td className="tableData" onClick={handleManagerName} style={{ cursor: "pointer" }}>{manager.gdo.gdoName}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {showEmpDiv && <div className="ManagerEmpsList">
                        <h3 style={{ textAlign: "center" }}>{clickedManagerName}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th className="tableHead">Name</th>
                                    <th className="tableHead">Project</th>
                                </tr>
                            </thead>
                            <tbody>
                                {EmpsUnderManager && EmpsUnderManager.map((emp, i) => {
                                    const handleEmpName = event => {
                                        const getEmpId = emp.id;
                                        setGetEmpId(getEmpId);
                                        setClickedEmpName(emp.name);
                                        const getRoleName = loggedinUser.role.roleName;
                                        setGetRole(getRoleName);
                                        handleEmpNameOutside(getEmpId, getRoleName);

                                    }
                                    return (
                                        <tr className="Row">
                                            <td onClick={handleEmpName} style={{ cursor: "pointer" }} className="tableData">{emp.name}</td>
                                            <td onClick={handleEmpName} style={{ cursor: "pointer" }} className="tableData">{emp.project.projName}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>}
                </div>
                <div className="EmpManagerTasks">
                    <h3 style={{ textAlign: "center",color:"yellow" }}>{showManagerTasks && clickedManagerName}</h3>
                    <h3 style={{ textAlign: "center",color:"yellow" }}>{showEmpTasks && clickedEmpName}</h3>
                    <table style={{marginLeft:"50px"}}>
                        <thead style={{ fontSize: "18px" }}>
                            <tr>
                                <th className="tableHead">Task</th>
                                <th className="tableHead">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showManagerTasks && managerTasks && managerTasks.map((managerTask, i) => {
                                const handleApproveReject = event => {
                                    let status;
                                    if (event.target.value === '1') {
                                        status = 'Approved';
                                    }
                                    else if (event.target.value === '2') {
                                        status = 'Rejected';
                                    }
                                    const clickedId = managerTask.id;
                                    const roleName = loggedinUser.role.roleName;
                                    const tasksRender = axios.put(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/ApproveORreject?taskId=${clickedId}&roleName=${roleName}&status=${status}`)
                                        .then((res) => {
                                            if (res.data.success) {
                                                handleManagerTasksOutside(stateManagerId);
                                                toast.success(`${status}`);
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        })
                                }
                                return (
                                    <tr className="Row">
                                        <td className="tableData">{managerTask.tasks}</td>
                                        <td className="tableData">{managerTask.date}</td>
                                        <tr>
                                            <button value="1" className="ApproveButton" onClick={handleApproveReject}>Approve</button>
                                            <button value="2" className="RejectButton" style={{ marginLeft: "10px" }} onClick={handleApproveReject}>Reject</button>
                                        </tr>
                                    </tr>
                                );
                            })}
                            {showEmpTasks && empTasksPendingAtAdmin && empTasksPendingAtAdmin.map((empTasksAtAdmin, i) => {
                                const handleApproveReject = event => {
                                    let status;
                                    if (event.target.value === '1') {
                                        status = 'Approved';
                                    }
                                    else if (event.target.value === '2') {
                                        status = 'Rejected';
                                    }
                                    const clickedId = empTasksAtAdmin.id;
                                    const roleName = loggedinUser.role.roleName;
                                    const tasksRender = axios.put(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/ApproveORreject?taskId=${clickedId}&roleName=${roleName}&status=${status}`)
                                        .then((res) => {
                                            handleEmpNameOutside(stateEmpId, stateRole);
                                            if (status === 'Rejected') {
                                                toast.warning(`You ${status} the task`);
                                            }
                                            if (status === 'Approved') {
                                                toast.success(`You ${status} the task`);
                                            }
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        })
                                }
                                return (
                                    <tr className="Row">
                                        <td className="tableData">{empTasksAtAdmin.tasks}</td>
                                        <td className="tableData">{empTasksAtAdmin.date}</td>
                                        <tr>
                                            <button value="1" className="ApproveButton" onClick={handleApproveReject}>Approve</button>
                                            <button value="2" className="RejectButton" style={{ marginLeft: "10px" }} onClick={handleApproveReject}>Reject</button>
                                        </tr>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer autoClose={500} />
        </div>
    );
}

export default ManagerUnderAdmin;