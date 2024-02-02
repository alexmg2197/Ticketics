import { React, useState } from "react";
import './login.css'
import { getAPI, postAPI } from "../../utils/useAxios";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import { motion } from "framer-motion"
import { toast } from "react-toastify";

const Login = ({ auth, setInicio, user }) => {

    const navigate = useNavigate();

    return (
        <motion.div initial={{ transform: "translateX(200%)" }} animate={{ transform: "translateX(0%)" }} className="card card-login">
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                validate={values => {
                    const errors = {};
                    if (!values.username) errors.username = 'Campo vacio'
                    if (!values.password) errors.password = 'Campo vacio'

                    return errors
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    let horario = new Date().getHours()
                    let day = new Date().getDay()
                    if(values.username === 'Guardia'){       
                        if(day >= 1 && day <=5 && horario < 17){
                            toast.error('El usuario de Guardia entre semana unicamente puede ser usado después de las 05:00 pm', {
                                autoClose: 2500,
                                position: 'top-right'
                            })
                            resetForm()
                        }else if(day !== 6 && horario < 9 && horario > 15){
                            toast.error('El usuario de Guardia los días Sábados unicamente puede ser usado entre 09 am y 3 pm', {
                                autoClose: 2500,
                                position: 'top-right'
                            })
                            resetForm()
                        }else if(day !== 0 && horario < 10 && horario > 15){
                            toast.error('El usuario de Guardia los días Domingos unicamente puede ser usado entre 10 am y 3 pm', {
                                autoClose: 2500,
                                position: 'top-right'
                            })
                            resetForm()
                        }else{
                            postAPI('api/token', values)
                                .then((res) => {
                                    if (res.tipo === 'token') {
                                        auth(true)
                                        localStorage.setItem('access_Token', res.data.access)
                                        localStorage.setItem('refresh_Token', res.data.refresh)
                                        var usu = jwtDecode(res.data.access)
                                        getAPI(`v1/PersonaByUser/${usu.user_id}`)
                                            .then((pp) => {
                                                user(pp.data[0].Rol)
                                                localStorage.setItem('Rol', pp.data[0].Rol)
                                            })
                                        navigate("/#/Principal");
                                    }
                                    if (res.tipo === 'error') {
                                        toast.error(res.mensaje, {
                                            autoClose: 1500,
                                            position: 'top-right'
                                        })
                                        resetForm()
                                    }
                                })
                        }
                    }else{
                        postAPI('api/token', values)
                            .then((res) => {
                                if (res.tipo === 'token') {
                                    auth(true)
                                    localStorage.setItem('access_Token', res.data.access)
                                    localStorage.setItem('refresh_Token', res.data.refresh)
                                    var usu = jwtDecode(res.data.access)
                                    getAPI(`v1/PersonaByUser/${usu.user_id}`)
                                        .then((pp) => {
                                            user(pp.data[0].Rol)
                                            localStorage.setItem('Rol', pp.data[0].Rol)
                                        })
                                    navigate("/#/Principal");
                                }
                                if (res.tipo === 'error') {
                                    toast.error(res.mensaje, {
                                        autoClose: 1500,
                                        position: 'top-right'
                                    })
                                    resetForm()
                                }
                            })
                    }
                }}
            >
                {
                    ({
                        values,
                        errors,
                        isSubmitting,
                        setFieldValue,
                        handleSubmit
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">Usuario</label>
                                    <input type="text" className={`form-control ${errors.username && 'mark_wrong'}`} id="username" placeholder="Ingresar Usuario" onChange={(val) => { setFieldValue('username', val.target.value) }} value={values.username} />
                                    <p className="eti-err">{errors.username}</p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input type="password" className={`form-control ${errors.password && 'mark_wrong'}`} id="password" placeholder='Ingresar Contraseña' onChange={(val) => { setFieldValue('password', val.target.value) }} value={values.password} />
                                    <p className="eti-err">{errors.password}</p>
                                </div>
                                <div className="d-boton d-grid gap-2">
                                    <button type="submit" className="btn btn_is" disabled={isSubmitting}>
                                        Iniciar Sesión
                                    </button>
                                </div>
                            </div>
                        </form>
                    )
                }
            </Formik>
            {/* <div className="mx-auto">
                <p>   No tienes cuenta <a href="#" onClick={() => { setInicio(2) }}>Registrate</a></p>
            </div> */}
        </motion.div>
    )
}

export default Login