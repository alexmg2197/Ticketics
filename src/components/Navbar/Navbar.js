import React from "react";
import { redirect } from "react-router-dom";
import './navbar.css';

const Navbar = ({ auth }) => {

    const Logout = () => {
        auth(false)
        localStorage.removeItem('access_Token')
        localStorage.removeItem('refresh_Token')
        localStorage.removeItem('Rol')
        redirect('/')
    }

    return (
        <div className="">
            <nav className="navbar navbar-dark flex-nowrap nav">
                <div className="container-fluid">
                    <a className="ti" href="/#/Principal">
                        <span >
                            TICKETICS
                        </span>
                    </a>
                    <div className="d-flex flex-colum align-items-center">
                        <div className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle flecha d-flex align-items-center" href="#" id="nav-user" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fa-regular fa-circle-user icon-user"  ></i>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="nav-user">
                                <li><a className="dropdown-item" href="/#/Perfil">Perfil</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#" onClick={() => { Logout() }}>Cerrar Sesión</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar