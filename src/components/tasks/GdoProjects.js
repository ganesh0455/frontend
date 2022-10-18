import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GdoProjects() {
    const navigate = useNavigate();
    const [projectsUnderGdo, setProjectsUnderGdo] = useState([]);
    const [selectedGdo, setSelectedGdo] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [showEmpProjDiv, setShowEmpProjDiv] = useState(false);
    const [projDiv, setShowProjDiv] = useState(false);
    const [EmpsUnderProject, setEmpsUnderProject] = useState([]);
    const loggedinUser = JSON.parse(localStorage.getItem('LoggedInUser'));
    const jwt = JSON.parse(localStorage.getItem('jwtToken'));

    useEffect(() => {
        //for jwt token
        console.log("you get into")
        if (jwt === null) {
            navigate('/login')
        }
    }, []);

    const handleGdo = event => {
        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/projectsUnderGdo?gdoId=${event.target.value}`)
            .then((response) => {
                setProjectsUnderGdo(response.data.data);
                setShowEmpProjDiv(false)
                setShowProjDiv(true);
                setSelectedGdo(response.data.data[0].gdo.gdoName);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div style={{ backgroundColor: "#1C2340" }}>
            <div className="Eheader">
                <div className="Home" onClick={() => { navigate('/viewTasks') }}>Home</div>
                <div className="logedUserName">{loggedinUser?.name}</div>
                <div className="gdoName">{loggedinUser.gdo.gdoName}</div>
                <div className="projName">{loggedinUser.project.projName}</div>
                <div className="logout" onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</div>
            </div>
            <div className="GDOProjects">
                <div className="GdoButtonsTitle">
                    <p style={{fontSize:"20px",color:"yellow",textAlign:"center"}}>Select any Gdo</p>
                    <button value="1" className="GdoButton" onClick={handleGdo}>Gdo1</button>
                    <button value="2" style={{ marginLeft: "10px" }} className="GdoButton" onClick={handleGdo}>Gdo2</button>
                    <button value="3" style={{ marginLeft: "10px" }} className="GdoButton" onClick={handleGdo}>Gdo3</button>
                    <button value="4" style={{ marginLeft: "10px" }} className="GdoButton" onClick={handleGdo}>Gdo4</button>
                </div>
                <div className="ProjectsListDiv">
                    {projDiv && <div className="ProjectsList">
                        <h3 style={{ textAlign: "center", color: "yellow" }}>{selectedGdo}</h3>
                        <table style={{marginLeft:"100px"}}>
                            <thead>
                                <tr>
                                    <th className="tableHead">Project Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectsUnderGdo && projectsUnderGdo.map((projects, i) => {
                                    const handleProject = event => {
                                        const getProjId = projects.id;
                                        setSelectedProject(projects.projName);
                                        setShowEmpProjDiv(true);
                                        axios.get(`http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/empsUnderProject?projId=${getProjId}`)
                                            .then((response) => {
                                                const resdata = response.data;
                                                setEmpsUnderProject(resdata.data);
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            })
                                    }
                                    return (
                                        <tr className="Row">
                                            <td onClick={handleProject} className="tableData" style={{cursor:"pointer"}}>{projects.projName}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>}
                    {showEmpProjDiv && <div className="EmpsListUnderProjDiv">
                        <h3 style={{ textAlign: "center", color: "yellow" }}>{selectedProject}</h3>
                        <table style={{marginLeft:"30px"}}>
                            <thead>
                                <tr>
                                    <th className="tableHead">Employee Name</th>
                                    <th className="tableHead">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {EmpsUnderProject && EmpsUnderProject.map((emps, i) => {
                                    return (
                                        <tr className="Row">
                                            <td className="tableData">{emps.name}</td>
                                            <td className="tableData">{emps.role.roleName}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default GdoProjects;