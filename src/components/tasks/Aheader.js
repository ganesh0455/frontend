import React from "react";
import { useNavigate } from "react-router-dom";

function AHeaders(){
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    return(
        <nav class="navbar navbar-inverse" style={{height:"53px"}}>
                <div class="container-fluid">
                    <ul class="nav navbar-nav">
                    <li><a style={{color:"#B9DCEC",cursor:"pointer"}} onClick={()=>{navigate('/GdoProjects')}}>Gdo & Projects</a></li>
                    <li><a style={{color:"#B9DCEC",cursor:"pointer"}} onClick={()=>navigate('/ManagerUnderAdmin')}>Employees & Managers</a></li>
                    <li><a style={{pointerEvents:"none",marginLeft:"440px",color:"white"}}>{loggedinUser?.name}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.gdo.gdoName}</a></li>
                    <li><a style={{pointerEvents:"none",color:"white"}}>{loggedinUser.project.projName}</a></li>
                    <li><a style={{cursor:"pointer",color:"red"}} onClick={() => { localStorage.clear(); navigate('/login')}}>Logout</a></li>
                    </ul>
                </div>
            </nav>
    );
}

export default AHeaders;