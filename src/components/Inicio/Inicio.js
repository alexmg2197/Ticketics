import { React, useState } from "react";
import Login from "../Login/Login";
import './inicio.css'
import { motion } from "framer-motion"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Registro from "../Registro/Registro";

const Inicio = ({ auth, user }) => {

    const [inicio, setInicio] = useState(0)

    return (
        <div className="fondo row m-0 p-0">
            <ToastContainer />
            <div className="col-lg-6 col-6 image">
                <img src="/assets/Logo-Fiscalia-2.png" className="imglogo" alt="imagenlogo" />
            </div>
            <div className="col-lg-6 col-6 d-flex flex-column justify-content-center align-items-center">
                <div className="contenedor-login d-flex flex-column justify-content-center align-items-center">
                    {
                        inicio !== 2
                            ? (
                                <div className="titulo-b">
                                    <p className="p">
                                        BIENVENIDO A
                                    </p>
                                </div>
                            )
                            : ""
                    }
                    <div className="titulo">
                        <p className="p">
                            TICKETICS
                        </p>
                    </div>
                    {
                        {
                            0: <motion.button className="btn btn-entrar" whileHover={{ scale: 1.5, backgroundColor: "#0C242D", color: "#FFFFFF" }} whileTap={{ scale: 0.9 }} onClick={() => { setInicio(1) }}>Entrar</motion.button>,
                            1: <Login auth={auth} setInicio={setInicio} user={user} />,
                            // 2: <Registro auth={auth} setInicio={setInicio} user={user}/>
                        }[inicio]
                    }
                </div>
            </div>
        </div>
    )
}

export default Inicio