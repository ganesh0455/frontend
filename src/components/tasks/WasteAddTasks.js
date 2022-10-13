import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function AddTasks() {
    const loggedinUser=JSON.parse(localStorage.getItem('LoggedInUser'));
    const [name,setName]=useState({
        tasks:''
    })

    const textareaHandler=event=>{
        setName({
            [event.target.name]:event.target.value
        })
    }

    const handleSubmit=event=>{
        event.preventDefault();
        axios.post(`http://localhost:8001/addtask?empId=${loggedinUser.id}`,{
            tasks:event.target.textArea.value
        })
        .then((res)=>{
            if(res.data.success){
                alert('Task inserted successfully');
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }



    return (
        <div>
            <div className='m-5 card p-3  mx-auto sh' style={{ width: '380px', height: '370px', boxShadow: '0 0 2px 2px', marginLeft: '500px', marginTop: '100px',borderRadius:'10px' }}>
                <form style={{ textAlign: "center" }} onSubmit={handleSubmit}>
                    <div>
                        <b><h3>Task</h3></b>
                        <textarea
                        cols="40"
                        rows="8"
                        placeholder='Enter your today Tasks'
                        name="textArea"
                        required="true"
                        type="text"
                        value={name.tasks}
                        onChange={textareaHandler} />
                    </div>
                    <br /><button className='btn btn-dark mt-2' type="submit" style={{marginTop:"60px"}}>Submit</button>
                    <br /><br /><b>View Your Tasks...?</b>&nbsp;&nbsp;
                    <Link to="/viewTasks">Click Here</Link>
                </form>
            </div>
        </div>
    );
}

export default AddTasks;