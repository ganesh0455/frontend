import axios from "axios";
import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManagerEmps(){
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));
    const [ManagerEmps,setManagerEmps]=useState([]);
    const [managerEmpTask,setManagerEmpTask]=useState([]);
    const [capturedId,setCapturedId]=useState('');
    const [stateEmpName,setStateEmpName]=useState('');
    const [empId,setEmpId]=useState('');
    const [getRole,setGetRole]=useState('');
    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if(jwt===null){
            navigate('/login')
        }
    }, [jwt]);

    const gdoId=loggedinUser.gdoId;
    useEffect(()=>{
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/managerEmps?gdoId=${gdoId}`)
        .then((res)=>{
            setManagerEmps(res.data.data);
        })
        .catch((error)=>{
            console.log(error)
        })
    },[])
    
    async function handleEmpOutside(clickedId,role,status)
    {
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/empPendingTasksAtManagerOrAdmin?empId=${clickedId}&role=${role}`)
            .then(res => {
            var resdata = res.data;
                setManagerEmpTask(resdata.data);
                if(status==='Approved'){
                    toast.success(`You ${status} ${stateEmpName}'s task`);
                }
                else if(status==='Rejected'){
                    toast.warning(`You ${status} ${stateEmpName}'s task`);
                }
            })
            .catch(err => {
            console.log(err);
        })
    }
    return(
        <div style={{backgroundColor:"#B9DCEC",minHeight:"100vh"}}>
            <div>
                <nav className="navbar navbar-inverse" style={{height:"53px"}}>
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                        <li><a style={{color:"#B9DCEC",cursor:"pointer"}} onClick={()=>{navigate('/viewTasks')}}>Home</a></li>
                        <li><a style={{pointerEvents:"none",marginLeft:"770px",color:"white"}}>{loggedinUser?.name}</a></li>
                        <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.gdo.gdoName}</a></li>
                        <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.project.projName}</a></li>
                        <li><a style={{cursor:"pointer",color:"red"}} onClick={() => { localStorage.clear(); navigate('/login')}}>Logout</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div style={{backgroundColor:"#B9DCEC",display:'flex'}}>
                <div style={{ height: '300px', width: '400px', boxShadow: '0 0 2px 2px', marginLeft: '120px', marginTop: "170px", borderRadius: '10px',backgroundColor:"#E4E4E4"}}>
                   <table className="table table-hover">
                        <thead style={{fontSize:"18px"}}>
                            <tr>
                                <th>Employee</th>
                                <th>Project Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ManagerEmps && ManagerEmps.map((emp,i)=>{
                                const getRole=loggedinUser.role.roleName;
                                const handleEmp=event=>{
                                    setStateEmpName(emp.name);
                                    setEmpId(emp.id);
                                    setGetRole(getRole);
                                    handleEmpOutside(emp.id,getRole);
                                }
                                return(
                                    <tr>
                                        <td onClick={handleEmp} style={{cursor:"pointer"}}>{emp.name}</td>
                                        <td>{emp.project.projName}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                   </table>
                </div>
                <div style={{ height: '570px', width: '700px', boxShadow: '0 0 2px 2px', marginLeft: '70px', borderRadius: '10px',backgroundColor:"#E4E4E4",overflow: "scroll"}}>
                    <h2 style={{textAlign:"center"}}>{stateEmpName}</h2>
                    <div style={{marginLeft:"90px"}}><table className="table table-hover">
                        <thead style={{fontSize:"18px"}}>
                            <tr>
                                <th>Task</th>
                                <th>Date</th>
                            <tr>
                                <th></th>
                            </tr>
                            </tr>
                        </thead>
                        <tbody>
                            {managerEmpTask && managerEmpTask.map((task,i)=>{
                                const handleApproveReject=event=>{
                                    let status;
                                    if(event.target.value==='1'){
                                        status='Approved';
                                    }
                                    else if(event.target.value==='2'){
                                        status='Rejected';
                                    }
                                    const clickedId=task.id;
                                    const roleName=loggedinUser.role.roleName;
                                    axios.put(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/ApproveORreject?taskId=${clickedId}&roleName=${roleName}&status=${status}`)
                                    .then((res)=>{
                                        handleEmpOutside(empId,getRole,status);
                                    })
                                    .catch((error)=>{
                                        console.log(error);
                                    })
                                }
                                return(
                                    <tr>
                                        <td>{task.tasks}</td>
                                        <td>{task.date}</td>
                                        <tr>
                                            <button value="1" className="btn btn-success" onClick={handleApproveReject}>Approve</button>
                                            <button value="2" className="btn btn-danger" style={{marginLeft:"15px"}} onClick={handleApproveReject}>Reject</button>
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

export default ManagerEmps;