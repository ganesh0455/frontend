import React from "react";
import { useNavigate } from "react-router-dom";

function EHeaders(){
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    return(
        <nav class="navbar navbar-inverse" style={{height:"53px"}}>
                <div class="container-fluid">
                    <ul class="nav navbar-nav">
                    <li><a style={{color:"rgb(114, 228, 114)",cursor:"pointer"}} onClick={() => {navigate('/approvedTasks')}}>Approved Tasks</a></li>
                    <li><a style={{color:"red",cursor:"pointer"}} onClick={() => {navigate('/rejectedTasks')}}>Rejected Tasks</a></li>
                    <li><a style={{pointerEvents:"none",marginLeft:"540px",color:"white"}}>{loggedinUser?.name}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.gdo.gdoName}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.project.projName}</a></li>
                    <li><a style={{cursor:"pointer",color:"red"}} onClick={() => { localStorage.clear(); navigate('/login')}}>Logout</a></li>
                    </ul>
                </div>
            </nav>
    );
}

export default EHeaders;