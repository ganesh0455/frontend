import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManagerUnderAdmin(){
    const navigate=useNavigate();
    const [AllManagers,setAllManagers]=useState([]);
    const [EmpsUnderManager,setEmpsUnderManager]=useState([]);
    const [showEmpDiv,setShowEmpDiv]=useState(false);
    const [clickedManagerName,setClickedManagerName]=useState('');
    const [managerTasks,setManagerTasks]=useState([]);
    const [empTasksPendingAtAdmin,setEmpTasksPendingAtAdmin]=useState([]);
    const [showManagerTasks,setShowManagerTasks]=useState(true);
    const [showEmpTasks,setShowEmpTasks]=useState(false);
    const [clickedEmpName,setClickedEmpName]=useState('');
    const [stateManagerId,setGetManagerId]=useState('');
    const [stateEmpId,setGetEmpId]=useState('');
    const [stateRole,setGetRole]=useState('');
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));

    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if(jwt===null){
            navigate('/login')
        }
    }, [jwt]);

    useEffect(()=>{
        axios.get('http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/allManagers')
        .then((response)=>{
            const resdata=response.data;
            setAllManagers(resdata.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    },[]);

    async function handleManagerTasksOutside(getManagerId)
    {
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/managerPendingTasksAtAdmin?managerId=${getManagerId}`)
        .then((response)=>{
            const resdata=response.data;
            setManagerTasks(resdata.data);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    async function handleEmpNameOutside(empId,getRole)
    {
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/empPendingTasksAtManagerOrAdmin?empId=${empId}&role=${getRole}`)
        .then((response)=>{
            const resdata=response.data;
            setEmpTasksPendingAtAdmin(resdata.data);
            setShowManagerTasks(false);
            setShowEmpTasks(true);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    return(
        <div style={{backgroundColor:"#B9DCEC",minHeight:"100vh"}}>
            <div>
                <nav className="navbar navbar-inverse" style={{height:"53px"}}>
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                        <li><a style={{color:"#28FF01"  ,cursor:"pointer"}} onClick={()=>{navigate('/viewTasks')}}>Home</a></li>
                        <li><a style={{color:"#B9DCEC",cursor:"pointer"}} onClick={()=>{navigate('/GdoProjects')}}>Gdo & Projects</a></li>
                        <li><a style={{pointerEvents:"none",marginLeft:"600px",color:"white"}}>{loggedinUser?.name}</a></li>
                        <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.gdo.gdoName}</a></li>
                        <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.project.projName}</a></li>
                        <li><a style={{cursor:"pointer",color:"red"}} onClick={() => { localStorage.clear(); navigate('/login')}}>Logout</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div style={{display:'flex',maxHeight:'100%'}}>
                <div >
                    <div style={{ height: '300px', width: '400px', boxShadow: '0 0 2px 2px', marginLeft: '20px', borderRadius: '10px',backgroundColor:"#E4E4E4",marginBottom:"10px",overflow:"scroll"}}>
                        <table className="table table-hover">
                            <thead style={{fontSize:"18px"}}>
                                <tr>
                                    <th>Name</th>
                                    <th>Project</th>
                                    <th>Gdo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {AllManagers && AllManagers.map((manager,i)=>{
                                    const handleManagerName=event=>{
                                        setShowEmpDiv(true);
                                        setShowManagerTasks(true);
                                        setShowEmpTasks(false);
                                        setClickedManagerName(manager.name)
                                        const getGdoId=manager.gdo.id;
                                        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/managerEmps?gdoId=${getGdoId}`)
                                        .then((res)=>{
                                            setEmpsUnderManager(res.data.data);
                                        })
                                        .catch((error)=>{
                                            console.log(error)
                                        })

                                        const getManagerId=manager.id;
                                        setGetManagerId(getManagerId);
                                        handleManagerTasksOutside(getManagerId);
                                    }
                                    return(
                                        <tr>
                                            <td onClick={handleManagerName} style={{cursor:"pointer"}}>{manager.name}</td>
                                            <td>{manager.project.projName}</td>
                                            <td>{manager.gdo.gdoName}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {showEmpDiv && <div style={{ height: '260px', width: '400px', boxShadow: '0 0 2px 2px', marginLeft: '20px', borderRadius: '10px',backgroundColor:"#E4E4E4",overflow:"scroll"}}>
                        <h3 style={{textAlign:"center"}}>Employees under {clickedManagerName}</h3>
                        <table className="table table-hover">
                            <thead style={{fontSize:"18px"}}>
                                <tr>
                                    <th>Name</th>
                                    <th>Project</th>
                                </tr>
                            </thead>
                            <tbody>
                                {EmpsUnderManager && EmpsUnderManager.map((emp,i)=>{
                                    const handleEmpName=event=>{
                                        const getEmpId=emp.id;
                                        setGetEmpId(getEmpId);
                                        setClickedEmpName(emp.name);
                                        const getRoleName=loggedinUser.role.roleName;
                                        setGetRole(getRoleName);
                                        handleEmpNameOutside(getEmpId,getRoleName);
                                        
                                    }
                                    return(
                                        <tr>
                                            <td onClick={handleEmpName} style={{cursor:"pointer"}}>{emp.name}</td>
                                            <td>{emp.project.projName}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>}
                </div>
                <div style={{ height: '570px', width: '700px', boxShadow: '0 0 2px 2px', marginLeft: '150px', borderRadius: '10px',backgroundColor:"#E4E4E4",overflow: "scroll"}}>
                    <h3 style={{textAlign:"center"}}>{showManagerTasks&&clickedManagerName}</h3>
                    <h3 style={{textAlign:"center"}}>{showEmpTasks&&clickedEmpName}</h3>
                    <div style={{marginLeft:"120px"}}><table className="table table-hover">
                        <thead style={{fontSize:"18px"}}>
                            <tr>
                                <th>Task</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showManagerTasks && managerTasks && managerTasks.map((managerTask,i)=>{
                                const handleApproveReject=event=>{
                                    let status;
                                    if(event.target.value==='1'){
                                        status='Approved';
                                    }
                                    else if(event.target.value==='2'){
                                        status='Rejected';
                                    }
                                    const clickedId=managerTask.id;
                                    const roleName=loggedinUser.role.roleName;
                                    const tasksRender=axios.put(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/ApproveORreject?taskId=${clickedId}&roleName=${roleName}&status=${status}`)
                                    .then((res)=>{
                                        if(res.data.success){
                                            handleManagerTasksOutside(stateManagerId);
                                            toast.success(`${status}`);
                                        }
                                    })
                                    .catch((error)=>{
                                        console.log(error);
                                    })
                                }
                                return(
                                    <tr>
                                        <td>{managerTask.tasks}</td>
                                        <td>{managerTask.date}</td>
                                        <tr>
                                            <button value="1" className="btn btn-success" onClick={handleApproveReject}>Approve</button>
                                            <button value="2" className="btn btn-danger" style={{marginLeft:"10px"}} onClick={handleApproveReject}>Reject</button>
                                        </tr>
                                    </tr>
                                );
                            })}
                            {showEmpTasks && empTasksPendingAtAdmin && empTasksPendingAtAdmin.map((empTasksAtAdmin,i)=>{
                                const handleApproveReject=event=>{
                                    let status;
                                    if(event.target.value==='1'){
                                        status='Approved';
                                    }
                                    else if(event.target.value==='2'){
                                        status='Rejected';
                                    }
                                    const clickedId=empTasksAtAdmin.id;
                                    const roleName=loggedinUser.role.roleName;
                                    const tasksRender=axios.put(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/ApproveORreject?taskId=${clickedId}&roleName=${roleName}&status=${status}`)
                                    .then((res)=>{
                                        handleEmpNameOutside(stateEmpId,stateRole);
                                        if(status==='Rejected'){
                                            toast.warning(`You ${status} the task`);
                                        }
                                        if(status==='Approved'){
                                            toast.success(`You ${status} the task`);
                                        }
                                    })
                                    .catch((error)=>{
                                        console.log(error);
                                    })
                                }
                                return(
                                    <tr>
                                        <td>{empTasksAtAdmin.tasks}</td>
                                        <td>{empTasksAtAdmin.date}</td>
                                        <tr>
                                            <button value="1" className="btn btn-success" onClick={handleApproveReject}>Approve</button>
                                            <button value="2" className="btn btn-danger" style={{marginLeft:"10px"}} onClick={handleApproveReject}>Reject</button>
                                        </tr>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table></div>
                </div>
            </div>
            <ToastContainer autoClose={500} />
        </div>
    );
}

export default ManagerUnderAdmin;