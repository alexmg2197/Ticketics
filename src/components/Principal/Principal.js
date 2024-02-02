import React from "react";
import './principal.css';
import { ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import Modulo from "../Modulos/Modulos";

const Principal = ({ auth, user }) => {
    return (
        <div className="father cont-principal">
            <ToastContainer />
            <Navbar auth={auth} />
            <div className="w-100 h-100">
                <Modulo user={user}/>
            </div>
        </div>
    )

}

export default Principal