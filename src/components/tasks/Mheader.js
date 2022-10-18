import React from "react";
import { useNavigate } from "react-router-dom";

function MHeaders() {
    const navigate = useNavigate();
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    return (
        <div className="Eheader">
            <div className="ApproveName" onClick={() => { navigate('/approvedTasks') }}>Approved Tasks</div>
            <div className="RejectName" onClick={() => { navigate('/rejectedTasks') }}>Rejected Tasks</div>
            <div className="YourEmps" onClick={()=>{navigate('/ManagerEmployees')}}>Your Employees</div>
            <div className="logedUserName">{loggedinUser?.name}</div>
            <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
            <div className="projName">{loggedinUser.project.projName}</div>
            <div className="logout" onClick={()=>{localStorage.clear();navigate('/login')}}>Logout</div>
        </div>
    );
}

export default MHeaders;