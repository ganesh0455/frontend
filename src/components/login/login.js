import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles.css'

function Login() {
    let navigate = useNavigate();
    const [name, setName] = useState({
        email: '',
        password: ''
    })

    const handleChange = event => {
        setName({
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/login", {
            email: event.target.email.value,
            password: event.target.password.value
        })
            .then(res => {
                localStorage.setItem('LoggedInUser', JSON.stringify(res.data.data));
                localStorage.setItem('jwtToken', JSON.stringify(res.data.jwt_token))
                const data = res.data;
                console.log(data.success);
                if(data.success){
                    navigate('/viewTasks');
                }
                else{
                    navigate('/login');
                }
            })
            .catch((err) => {
                console.log("err=", err.response.data)
                toast.error(`${err.response.data.message}`);
            })
    }

    return (
        <div className="mainDiv">
            <p className="font-effect-fire-animation">Employee Task Recorder</p>
            <div className='loginDiv'>
                <form className='form' style={{ textAlign: "center" }} onSubmit={handleSubmit}>
                    <b><p style={{ fontSize: '20px' }}>Login</p></b>
                    <input className="form-control"
                        style={{ width: "270px", marginBottom: '10px', marginTop: '40px', marginLeft: "60px" }}
                        type="email"
                        name="email"
                        required
                        value={name.email}
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                    <input className="form-control mt-5"
                        style={{ width: "270px", marginLeft: "60px", marginTop: '20px' }}
                        type="password"
                        name="password"
                        required
                        value={name.password}
                        placeholder="Enter your password"
                        onChange={handleChange}
                    />
                    <br /><br /><button className="btn btn-dark" id="loginButton">Login</button>
                    <br /><br /><b style={{fontSize:"15px"}}>Don't have account...?</b>&nbsp;&nbsp;&nbsp;
                    <Link to="/signup" style={{fontSize:"16px",color:"#6295EC"}}>Click Here</Link>
                </form>
            </div>
            <ToastContainer autoClose={2000}/>
        </div>
    );
}

export default Login;