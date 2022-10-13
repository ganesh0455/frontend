import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Signup from './components/login/signup';
import Login from './components/login/login';
import ViewTasks from './components/tasks/viewTasks';
import EHeaders from './components/tasks/Eheaders';
import MHeaders from './components/tasks/Mheader';
import AHeaders from './components/tasks/Aheader';
import ApprovedTasks from './components/tasks/approvedEmpManagerTasks';
import RejectedTasks from './components/tasks/rejectedEmpManagerTasks';
import ManagerEmps from './components/tasks/ManagerEmployees';
import ManagerUnderAdmin from './components/tasks/ManagerUnderAdmin';
import GdoProjects from './components/tasks/GdoProjects';
import BackImg from './components/login/backgroundImg';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/viewTasks" element={<ViewTasks />}></Route>
          <Route path="/viewTasks" element={<EHeaders />}></Route>
          <Route path="/viewTasks" element={<MHeaders />}></Route>
          <Route path="/viewTasks" element={<AHeaders />}></Route>
          <Route path="/approvedTasks" element={<ApprovedTasks />}></Route>
          <Route path="/rejectedTasks" element={<RejectedTasks />}></Route>
          <Route path="/ManagerEmployees" element={<ManagerEmps />}></Route>
          <Route path="/ManagerUnderAdmin" element={<ManagerUnderAdmin />}></Route>
          <Route path="/GdoProjects" element={<GdoProjects />}></Route>
          <Route path='/backImg' element={<BackImg />}></Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
