import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ViewTasks() {
    const navigate=useNavigate();
    const loggedinUser=JSON.parse(localStorage.getItem('userdetails'));
    const [projects, setProjects] = useState([]);


    useEffect(() => {
        //for jwt token
    }, [])

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('LoggedInUser'));
        console.log("user=", user);
        console.log("user.gdo=", user.gdoId);
        axios.get(`http://localhost:8001/projectsUnderGdo?gdoId=${user.gdoId}`)
            .then(res => {
                var resdata = res.data;
                console.log("resdata", resdata.data);
                setProjects(resdata.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <button className="btn btn-light" onClick={() => navigate('/employee')}>Home</button>
                            </li>
                            <li class="nav-item">
                                <button className="btn btn-light" onClick={() => navigate(`/empployee/Approved/${loggedinUser.id}`)}>Approved Tasks</button>
                            </li>
                            <li class="nav-item">
                                {<a class="nav-link disabled ml-150" href="#" tabindex="-1" aria-disabled="true" style={{ marginLeft: "800px", color: 'white' }}></a>}
                            </li>
                        </ul>
                        <form class="d-flex">
                            <button class="btn btn-light ml-5" onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</button>
                        </form>
                    </div>
                </div>
            </nav>
            <div className='m-5 card p-3  mx-auto sh' style={{ height: '500px', width: '400px', boxShadow: '0 0 2px 2px', marginLeft: '500px', marginTop: "50px", borderRadius: '10px' }}>
                <ul>
                    <h3 style={{ textAlign: "center" }}>Project Name</h3>
                    {projects && projects.map((proj, i) => {
                        return (
                            <div>
                                <button className="btn btn-secondary" style={{ width: "300px", marginBottom: "10px" }}>
                                    {proj.projName}
                                </button>
                                <br />
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ViewTasks;