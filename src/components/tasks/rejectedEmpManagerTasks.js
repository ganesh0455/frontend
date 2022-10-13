import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Rejected(){
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));
    const [rejectedTasks,setRejectedTasks]=useState([]);
    const [edit, setEdit] = useState(false);
    const [needToUpdate,setNeedToUpdate]=useState('')
    const [captureClickedTaskId, setCaptureClickedTaskId] = useState('');
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
        if(jwt===null){
            navigate('/login')
            window.location.reload(true);
        }
    }, []);

    useEffect(()=>{
        axios.get(`http://localhost:8001/rejectedEmpTasks?empId=${loggedinUser.id}&role=${loggedinUser.role.roleName}`)
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
    console.log("capturedId",capturedId)
    const handleUpdate=event=>{
        event.preventDefault();
        axios.put(`http://localhost:8001/updateTask?taskId=${capturedId}`, {
            tasks: event.target.textArea.value
        })
        .then((res) => {
            console.log(res);
            if (res.data.success) {
                setEdit({
                    edit:false
                })
                setTask({
                    textArea:''
                })
                //window.location.reload(true);
                toast.success(`${res.data.message}`);
                setTimeout(()=>{window.location.reload(true)},1000);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    return(
        <div style={{backgroundColor:"#B9DCEC"}}>
            <nav className="navbar navbar-inverse" style={{height:"53px"}}>
                <div className="container-fluid">
                    <ul className="nav navbar-nav">
                    <li><a style={{color:"#B9DCEC",cursor:"pointer"}} onClick={()=>{navigate('/viewTasks')}}>Home</a></li>
                    <li><a style={{color:"rgb(114, 228, 114)",cursor:"pointer"}} onClick={() => {navigate('/approvedTasks')}}>Approved Tasks</a></li>
                    <li><a style={{pointerEvents:"none",marginLeft:"600px",color:"white"}}>{loggedinUser?.name}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.gdo.gdoName}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.project.projName}</a></li>
                    <li><a style={{cursor:"pointer",color:"red"}} onClick={() => { localStorage.clear(); navigate('/login')}}>Logout</a></li>
                    </ul>
                </div>
            </nav>
            <div className='m-5 card p-3  mx-auto sh' style={{ height: '500px', width: '750px', boxShadow: '0 0 2px 2px', marginLeft: '300px', marginTop: "10px", borderRadius: '10px', overflow: "scroll",backgroundColor:"#E4E4E4"}}>
                <ul>
                    <h3 style={{ textAlign: "center",color:"red" }}>Rejected Tasks</h3>
                    <div style={{marginLeft:"20px"}}><table className="table table-hover">
                        <thead style={{fontSize:"18px"}}>
                            <tr>
                                <th>Task</th>
                                <th>Date</th>
                                <th>Rejected By</th>
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
                                const handleEdit=event=>{
                                    setEdit({
                                        edit:true
                                    })
                                    var clickedTask=task.tasks;
                                    console.log("clickedTask",clickedTask);
                                    setNeedToUpdate({
                                        needToUpdate:clickedTask
                                    })
                                    console.log("clicked taskId=",task.id)
                                    setCaptureClickedTaskId({
                                        captureClickedTaskId:task.id
                                    })
                                }
                                const onChangeEdit = event => {
                                    [event.target.name] = event.target.value
                                }
                                return(
                                    <tr>
                                        <td>{task.tasks}</td>
                                        <td>{task.date}</td>
                                        <td>{stat}</td>
                                        <tr>
                                            <button className="btn btn-info" onClick={handleEdit} onChange={onChangeEdit}>Edit</button>
                                        </tr>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table></div>
                </ul>
            </div>
            {edit?<div>
                <form style={{ display: "flex", marginTop: "10px", marginLeft: "500px" }} onSubmit={handleUpdate}>
                    <textarea placeholder="Update your task"
                        rows="3"
                        cols="50"
                        name="textArea"
                        required="true"
                        type="text"
                        onChange={textAreaHandler}
                    >
                        {updateThis}
                    </textarea>
                    <button type="submit" className="btn btn-success" style={{ height: "35px", marginTop: "15px", marginLeft: "15px" }}>Update</button>
                </form>
            </div>:
            <div style={{height:"66px",display: "flex", marginTop: "10px", marginLeft: "500px" }}></div>}
            <ToastContainer autoClose={500}/>
        </div>
    );
}

export default Rejected;