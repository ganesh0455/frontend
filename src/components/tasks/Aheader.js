import React from "react";
import { useNavigate } from "react-router-dom";

function AHeaders() {
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    return (
        <div className="Eheader">
            <div className="GdoProjects" onClick={() => { navigate('/GdoProjects') }}>Gdo & Projects</div>
            <div className="ManagersAndEmps" onClick={() => { navigate('/ManagerUnderAdmin') }}>Managers And Employees</div>
            <div className="logedUserName">{loggedinUser?.name}</div>
            <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
            <div className="projName">{loggedinUser.project.projName}</div>
            <div className="logout" onClick={()=>{localStorage.clear();navigate('/login')}}>Logout</div>
        </div>
    );
}

export default AHeaders;