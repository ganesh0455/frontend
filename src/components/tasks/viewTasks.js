import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AHeaders from "./Aheader";
import MHeaders from "./Mheader";
import '../styles.css'
import EHeaders from "./Eheaders";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ViewTasks() {
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const Role=loggedinUser.role.roleName;
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));
    const [tasks, setTasks] = useState([]);
    const [editTask, setEditTask] = useState(false);
    const [needToUpdate, setNeedToUpdate] = useState('');
    const [captureClickedTaskId, setCaptureClickedTaskId] = useState('');
    const [findrole,setRole]=useState('');
    const [managerName,setManagerName]=useState('');
    const [name, setName] = useState({
        tasks: ''
    })
    
    useEffect(() => {
        //for jwt token
        if(jwt===null){
            navigate('/login');
        }
    }, [jwt]);

    
    const textareaHandler = event => {
        setName({
            [event.target.name]: event.target.value
        })
    }

    async function viewYourTasks(loggedinUser,getRole)
    {
        axios.get(`http://localhost:8001/viewtask?empId=${loggedinUser.id}&roleName=${getRole}`)
            .then(res => {
                var resdata = res.data;
                setTasks(resdata.data);
                setName({
                    tasks:''
                })
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        const gdoId=loggedinUser.gdoId;
        setRole({
            findrole:loggedinUser.role.roleName
        })
        viewYourTasks(loggedinUser,Role);
        axios.get(`http://localhost:8001/managerOfemp?gdoId=${gdoId}`)
        .then((response)=>{
            var ManagerNameResponse=response.data;
            console.log("ManagerNameResponse.data",ManagerNameResponse.data);
            const nameOfManager=ManagerNameResponse.data.name;
            setManagerName(nameOfManager);
        })
        .catch((error)=>{
            console.log(error);
        })
    }, [])

    async function handleSubmitAddTask(event) {
        event.preventDefault();
        axios.post(`http://localhost:8001/addtask?empId=${loggedinUser.id}`, {
            tasks: event.target.textArea.value
        })
        .then((res) => {
            if (res.data.success) {
                toast.success(`${res.data.message}`);
                viewYourTasks(loggedinUser,Role);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const TaskId = captureClickedTaskId.captureClickedTaskId;
    async function handleSubmitEditTask(event) {
        event.preventDefault();
        axios.put(`http://localhost:8001/updateTask?taskId=${TaskId}`, {
            tasks: event.target.textArea.value
        })
        .then((res) => {
            if (res.data.success) {
                viewYourTasks(loggedinUser,Role);
                setEditTask(false);
                setName({
                    tasks: ''
                })
                toast.info(`${res.data.message}`);
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return (
        <div style={{backgroundColor:"#B9DCEC"}}>
            {Role==='employee' && <EHeaders />}
            {Role==='manager' && <MHeaders />}
            {Role==='admin' && <AHeaders />}
            <div className='m-5 card p-3  mx-auto sh' style={{ height: '500px', width: '850px', boxShadow: '0 0 2px 2px', marginLeft: '250px', marginTop: "10px", borderRadius: '10px', overflow: "scroll",backgroundColor:"#E4E4E4"}}>
                <ul>
                    <h3 style={{ textAlign: "center" }}>Your Daily Tasks</h3>
                    <table className="table table-hover">
                        <thead style={{fontSize:"18px",textAlign:"center"}}>
                            <tr>
                                <th>Task</th>
                                <th>Date</th>
                                {Role==='admin'?<></>:<th>Approval Waiting AT</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {tasks && tasks.map((task, i) => {
                                let stat;
                                const role=loggedinUser.role.roleName;
                                if (role==="employee" && task.Mstatus === "Pending") {
                                    stat = `${managerName}`
                                }
                                else if (task.Astatus === "Pending") {
                                    stat = "Srinivas"
                                }
                                const handleDelete = event => {
                                    axios.delete(`http://localhost:8001/deleteTask?taskId=${task.id}`)
                                        .then((res) => {
                                            if (res.data.success) {
                                                toast.error(`${res.data.message}`);
                                                viewYourTasks(loggedinUser,Role);
                                                //setTimeout(()=>{window.location.reload(true)},1000);
                                            }
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        })
                                }
                                const handleEdit = event => {
                                    setEditTask({
                                        editTask: true
                                    });
                                    var clickedTask = task.tasks;
                                    setNeedToUpdate({
                                        needToUpdate: clickedTask
                                    })
                                    setCaptureClickedTaskId({
                                        captureClickedTaskId: task.id
                                    })
                                }
                                const onChangeEdit = event => {
                                    [event.target.name] = event.target.value;
                                }
                                if(Role==='manager' || Role==='employee')
                                {
                                    return (
                                        <tr>
                                            <td style={{width:"180px"}}>{task.tasks}</td>
                                            <td>{task.date}</td>
                                            <td>{stat}</td>
                                            <tr>
                                                <button className="btn btn-info" name="edit" onClick={handleEdit} onChange={onChangeEdit}>Edit</button>
                                                <button style={{ marginLeft: "5px" }} className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                            </tr>
                                        </tr>
                                    );
                                }
                                else{
                                    return (
                                        <tr>
                                            <td>{task.tasks}</td>
                                            <td>{task.date}</td>
                                            <tr>
                                                <button className="btn btn-info" name="edit" onClick={handleEdit} onChange={onChangeEdit}>Edit</button>
                                                <button style={{ marginLeft: "5px" }} className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                            </tr>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                </ul>
            </div>
            {editTask? <div>
                <form style={{ display: "flex", marginTop: "10px", marginLeft: "500px" }} onSubmit={handleSubmitEditTask}>
                    <textarea placeholder="Update your task"
                        rows="3"
                        cols="50"
                        name="textArea"
                        required="true"
                        type="text"
                        onChange={textareaHandler}
                    >
                        {needToUpdate.needToUpdate}
                    </textarea>
                    <button type="submit" className="btn btn-success" style={{ height: "35px", marginTop: "15px", marginLeft: "15px" }}>Update</button>
                </form>
            </div> : <form className="textArea" style={{ display: "flex", marginTop: "10px", marginLeft: "500px" }} onSubmit={handleSubmitAddTask}>
                <textarea placeholder="Enter your task"
                    rows="3"
                    cols="50"
                    name="textArea"
                    required="true"
                    type="text"
                    backgroundColor="green"
                    value={name.tasks}
                    onChange={textareaHandler}
                >
                </textarea>
                <button type="submit" className="btn btn-success" style={{ height: "35px", marginTop: "15px", marginLeft: "15px" }}>Add Task</button>
            </form>}
            <ToastContainer autoClose={500} />
        </div>
    );
}

export default ViewTasks;