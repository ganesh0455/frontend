import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function backImg(){
    const notify=()=>{
        toast("hello");
    }
    return(
        <div >
            <button onClick={notify}>Notify!</button>
            <ToastContainer />
        </div>
    );
}

export default backImg;