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
        <div style={{backgroundColor:"#1C2340"}}>
            <div className="Eheader">
                <div className="Home" onClick={() => { navigate('/viewTasks') }}>Home</div>
                <div className="logedUserName">{loggedinUser?.name}</div>
                <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
                <div className="projName">{loggedinUser.project.projName}</div>
                <div className="logout" onClick={()=>{localStorage.clear();navigate('/login')}}>Logout</div>
            </div>
            <div className="ViewTasksMainDiv">
                <div className="EmployeesListDiv">
                   <table>
                        <thead style={{fontSize:"18px"}}>
                            <tr>
                                <th className="tableHead">Employee</th>
                                <th className="tableHead">Project Name</th>
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
                                    <tr className="Row">
                                        <td onClick={handleEmp} className="tableData" style={{cursor:"pointer"}}>{emp.name}</td>
                                        <td onClick={handleEmp} className="tableData" style={{cursor:"pointer"}}>{emp.project.projName}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                   </table>
                </div>
                <div className="EmployeesTasksListDiv">
                    <p style={{textAlign:"center",color:"yellow",fontSize:"20px"}}>{stateEmpName}</p>
                    <table>
                        <thead>
                            <tr>
                                <th className="tableHead">Task</th>
                                <th className="tableHead">Date</th>
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
                                    <tr className="Row">
                                        <td className="tableData">{task.tasks}</td>
                                        <td className="tableData">{task.date}</td>
                                        <tr>
                                            <button value="1" className="ApproveButton" onClick={handleApproveReject}>Approve</button>
                                            <button value="2" className="RejectButton" onClick={handleApproveReject}>Reject</button>
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

export default ManagerEmps;