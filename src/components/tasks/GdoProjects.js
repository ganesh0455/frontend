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
            window.location.reload(true);
        }
    }, []);

    const handleGdo = event => {
        console.log("clickedButton=", event.target.value);
        axios.get(`http://localhost:8001/projectsUnderGdo?gdoId=${event.target.value}`)
            .then((response) => {
                console.log("res=", response.data.data);
                setProjectsUnderGdo(response.data.data);
                setShowEmpProjDiv(false)
                setShowProjDiv(true);
                console.log("selectedGdo=", response.data.data[0].gdo.gdoName);
                setSelectedGdo(response.data.data[0].gdo.gdoName);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <div style={{ backgroundColor: "#B9DCEC", minHeight: "100vh" }}>
            <div>
                <nav className="navbar navbar-inverse" style={{ height: "53px" }}>
                    <div className="container-fluid">
                        <ul className="nav navbar-nav">
                            <li><a style={{ color: "#28FF01", cursor: "pointer" }} onClick={() => { navigate('/viewTasks') }}>Home</a></li>
                            <li><a style={{ color: "#B9DCEC", cursor: "pointer" }} onClick={() => navigate('/ManagerUnderAdmin')}>Employees & Managers</a></li>
                            <li><a style={{ pointerEvents: "none", marginLeft: "570px", color: "white" }}>{loggedinUser?.name}</a></li>
                            <li><a style={{ pointerEvents: "none", color: "white" }}>{loggedinUser.gdo.gdoName}</a></li>
                            <li><a style={{ pointerEvents: "none", color: "white" }}>{loggedinUser.project.projName}</a></li>
                            <li><a style={{ cursor: "pointer", color: "red" }} onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</a></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
                <h2>Select any Gdo</h2>
                <button value="1" className="btn btn-success" onClick={handleGdo}>Gdo1</button>
                <button value="2" style={{ marginLeft: "10px" }} className="btn btn-success" onClick={handleGdo}>Gdo2</button>
                <button value="3" style={{ marginLeft: "10px" }} className="btn btn-success" onClick={handleGdo}>Gdo3</button>
                <button value="4" style={{ marginLeft: "10px" }} className="btn btn-success" onClick={handleGdo}>Gdo4</button>
            </div>
            <div style={{ backgroundColor: "#B9DCEC", display: 'flex', maxHeight: '100%' }}>
                {projDiv && <div style={{ height: '460px', width: '500px', boxShadow: '0 0 2px 2px', marginLeft: '240px', borderRadius: '10px', backgroundColor: "#E4E4E4", marginBottom: "10px" }}>
                    <h3 style={{ textAlign: "center", color: "#2A1585" }}>Projects under : {selectedGdo}</h3>
                    <table className="table table-hover">
                        <thead style={{ fontSize: "18px" }}>
                            <tr>
                                <th rowSpan="2">Project Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectsUnderGdo && projectsUnderGdo.map((projects, i) => {
                                const handleProject = event => {
                                    console.log("projClickedId=", projects.id);
                                    const getProjId = projects.id;
                                    setSelectedProject(projects.projName);
                                    setShowEmpProjDiv(true);
                                    axios.get(`http://localhost:8001/empsUnderProject?projId=${getProjId}`)
                                        .then((response) => {
                                            const resdata = response.data;
                                            console.log("resdata=", resdata);
                                            setEmpsUnderProject(resdata.data);
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        })
                                }
                                return (
                                    <tr>
                                        <td onClick={handleProject} style={{ cursor: "pointer" }}>{projects.projName}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>}
                {showEmpProjDiv && <div style={{ height: '460px', width: '500px', boxShadow: '0 0 2px 2px', marginLeft: '20px', borderRadius: '10px', backgroundColor: "#E4E4E4" }}>
                    <h3 style={{ textAlign: "center", color: "#2A1585" }}>Employees Under : {selectedProject}</h3>
                    <table className="table table-hover">
                        <thead style={{ fontSize: "18px" }}>
                            <tr>
                                <th>Employee Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {EmpsUnderProject && EmpsUnderProject.map((emps, i) => {
                                return (
                                    <tr>
                                        <td>{emps.name}</td>
                                        <td>{emps.role.roleName}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>}
            </div>
        </div>
    );
}

export default GdoProjects;