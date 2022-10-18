import React from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Signup()
{
    const navigate=useNavigate();
    const [name,setName]=useState({
        name:'',
        email:'',
        password:'',
        gdoId:'',
        projId:'',
        roleId:''
    });
    const changeHandler=event=>{
        setName({
            [event.target.name]: event.target.value
        })
    }

    const handleSubmit=event=>{
        event.preventDefault();
        axios.post('http://employeetaskrecorder.uksouth.cloudapp.azure.com:8001/signUp',{
            name:event.target.name.value,
            email:event.target.email.value,
            password:event.target.password.value,
            gdoId:event.target.gdo.value,
            projId:event.target.project.value,
            roleId:event.target.role.value
        })
        .then(res=>{
            console.log(res.data);
            const data=res.data;
            console.log("data.message=",data.message)
            toast.success(`${data.message}`);
            setTimeout(()=>{navigate('/login')},1000)
        })
        .catch((err)=>{
            console.log("err=",err.response.data)
            toast.error(err.response.data.message);
        })
    }
    return(
        <div className="mainDiv">
            <div className='loginDiv'>
                <form onSubmit={handleSubmit} style={{textAlign:"center"}}>
                    <div>
                        <b><p style={{fontSize:'18px'}}>Sign Up</p></b>
                        <input className='form-control mt-2'
                            style={{width:"270px",marginLeft:"50px",marginBottom:'10px'}}
                            required="true"
                            type="text"
                            name="name"
                            value={name.name}
                            onChange={changeHandler}
                            placeholder="Enter your Name..."
                        />
                        <input className='form-control mt-2'
                            style={{width:"270px",marginLeft:"50px",marginBottom:'10px'}}
                            type="email"
                            name="email"
                            required="true"
                            value={name.email}
                            onChange={changeHandler}
                            placeholder="Enter the Email..."
                        />
                        <input className='form-control mt-2'
                            style={{width:"270px",marginLeft:"50px",marginBottom:'10px'}}
                            type="password"
                            name="password"
                            required="true"
                            value={name.password}
                            onChange={changeHandler}
                            placeholder="Enter password..."
                            />
                        <select name='gdo' value={name.gdo} className="selectOption">
                            <option value="1">GDO 1</option>
                            <option value="2">GDO 2</option>
                            <option value="3">GDO 3</option>
                            <option value="4">GDO 4</option>
                            onChange={changeHandler}
                        </select>
                        <select name='project' value={name.project} className="selectOption">
                            <option value="1">BKI</option>
                            <option value="2">HMIS</option>
                            <option value="3">Cents</option>
                            <option value="4">SMG</option>
                            <option value="5">PLM</option>
                            <option value="6">BlockChain</option>
                            <option value="7">p2</option>
                            <option value="8">p3</option>
                            <option value="9">sales</option>
                            <option value="10">oneportal</option>
                            onChange={changeHandler}
                        </select>
                        <select name='role' value={name.role} className="selectOption">
                            <option value="1">employee</option>
                            <option value="2">manager</option>
                            <option value="3">admin</option>
                            onChange={changeHandler}
                        </select>
                        <br></br>
                    </div>
                    <br></br><button className="btn btn-dark" type="submit" id="loginButton">Submit</button>
                    <br></br><br></br><b style={{fontSize:"18px"}}>have an account..?</b>&nbsp;&nbsp;&nbsp;
                    <Link to="/login" style={{fontSize:"16px",color:"#6295EC"}}>Click Here</Link>
                </form>
            </div>
            <ToastContainer autoClose={2000} />
        </div>
    );
}

export default Signup;