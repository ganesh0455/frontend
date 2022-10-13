import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css'

function Approved(){
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));
    const [rejectedTasks,setRejectedTasks]=useState([]);
    const [needToUpdate,setNeedToUpdate]=useState('')
    const [captureClickedTaskId, setCaptureClickedTaskId] = useState('');

    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if(jwt===null){
            navigate('/login')
            window.location.reload(true);
        }
    }, []);

    const [task,setTask]=useState({
        textArea:''
    });
    console.log("needToUpdate====",needToUpdate.needToUpdate);
    const updateThis=needToUpdate.needToUpdate;
    console.log("updateThis",updateThis)
    const textAreaHandler=event=>{
        setTask({
            [event.target.name]:event.target.value
        })
    }
    useEffect(() => {
        //for jwt token
        console.log("you get into")
        console.log("jwt",jwt);
        if(jwt===null){
            navigate('/login')
            window.location.reload(true);   
        }
    },[]);
    // useEffect(()=>{
    //     axios.get('http://localhost:8001/')
    // })

    useEffect(()=>{
        axios.get(`http://localhost:8001/approvedEmpTasks?empId=${loggedinUser.id}&role=${loggedinUser.role.roleName}`)
        .then((response)=>{
            console.log(response)
            const fdata=response.data.data;
            console.log("fdata=",fdata)
            setRejectedTasks(fdata);
            console.log("rejectedTasks",rejectedTasks)
        })
        .catch((error)=>{
            console.log(error);
        })
    },[])

    console.log("captureClickedTaskId======",captureClickedTaskId);
    const capturedId = captureClickedTaskId.captureClickedTaskId;
    return(
        <div style={{backgroundColor:"#B9DCEC"}}>
            <nav className="navbar navbar-inverse" style={{height:"53px"}}>
                <div className="container-fluid">
                    <ul className="nav navbar-nav">
                    <li><a style={{color:"#B9DCEC",cursor:"pointer"}} onClick={()=>{navigate('/viewTasks')}}>Home</a></li>
                    <li><a style={{color:"red",cursor:"pointer"}} onClick={() => {navigate('/rejectedTasks')}}>Rejected Tasks</a></li>
                    <li><a style={{pointerEvents:"none",marginLeft:"600px",color:"white"}}>{loggedinUser?.name}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.gdo.gdoName}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.project.projName}</a></li>
                    <li><a style={{cursor:"pointer",color:"red"}} onClick={() => { localStorage.clear(); navigate('/login')}}>Logout</a></li>
                    </ul>
                </div>
            </nav>
            <div className='m-5 card p-3  mx-auto sh' style={{ height: '500px', width: '750px', boxShadow: '0 0 2px 2px', marginLeft: '300px', marginTop: "10px", borderRadius: '10px', overflow: "scroll",backgroundColor:"#E4E4E4"}}>
                <ul>
                    <h3 style={{ textAlign: "center",color:"green" }}>Approved Tasks</h3>
                    <div style={{width:"500px",marginLeft:"160px"}}><table className="table table-hover">
                        <thead style={{fontSize:"18px"}}>
                            <tr>
                                <th>Task</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rejectedTasks && rejectedTasks.map((task,i)=>{
                                let stat;
                                if (task.Mstatus === "Rejected") {
                                    stat = "Manager"
                                }
                                else if (task.Astatus === "Rejected") {
                                    stat = "Srinivas"
                                }
                                return(
                                    <tr>
                                        <td>{task.tasks}</td>
                                        <td>{task.date}</td>
                                        <td>{stat}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table></div>
                </ul>
            </div>
            <div style={{height:"66px",display: "flex", marginTop: "10px", marginLeft: "500px" }}></div>
        </div>
    );
}

export default Approved;