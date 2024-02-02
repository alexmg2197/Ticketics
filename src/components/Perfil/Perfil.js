import { React, useEffect, useState } from "react";
import { getAPI, patchAPI } from "../../utils/useAxios";
import './perfil.css'
import Navbar from "../Navbar/Navbar"
import Swal from "sweetalert2";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode'
import Loader from "../Loader/Loader"

const Perfil = ({ auth }) => {

    const [persona, setPersona] = useState(null)
    const [load, setLoad] = useState(true)
    const navigate = useNavigate();
    var token = jwtDecode(localStorage.getItem('access_Token'))

    useEffect(() => {
        getAPI(`v1/PersonaByUser/${token.user_id}`)
            .then((response) => {
                setPersona(response.data)
                setLoad(false)
            })
    }, [])

    const replace = (str) => {
        const accentMap = {
            'á': 'a',
            'é': 'e',
            'í': 'i',
            'ó': 'o',
            'ú': 'u',
            'Á': 'A',
            'É': 'E',
            'Í': 'I',
            'Ó': 'O',
            'Ú': 'U',
            'Ñ': 'N',
            'ñ': 'n'
        };

        return str.replace(/[áéíóúÁÉÍÓÚÑñ]/g, (match) => accentMap[match] || match);
    };

    return (
        <div className="fondo-perfil cont-perfil">
            <Navbar auth={auth} />
            {
                load && <Loader />
            }
            <div className="p-3">
                <h1 className="text-center">Perfil</h1>
            </div>
            <div className="container w-50 d-flex justify-content-center border p-5">
                <div className="row w-100 ">
                    {
                        persona !== null &&
                        <Formik
                            initialValues={{
                                nombre: persona[0].Nombre,
                                aPaterno: persona[0].ApellidoP,
                                aMaterno: persona[0].ApellidoM,
                                correo: persona[0].cred.email,
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.nombre) errors.nombre = 'Campo vacio'
                                if (!values.aPaterno) errors.aPaterno = 'Campo vacio'
                                if (!values.aMaterno) errors.aMaterno = 'Campo vacio'
                                if (!values.correo) errors.correo = 'Campo vacio'
                                return errors
                            }}
                            onSubmit={(values, { setSubmitting, resetForm }) => {

                                const template = {}
                                if (persona[0].Nombre !== values.nombre) template.Nombre = replace(values.nombre)
                                if (persona[0].ApellidoP !== values.aPaterno) template.ApellidoP = replace(values.aPaterno)
                                if (persona[0].ApellidoM !== values.aMaterno) template.ApellidoM = replace(values.aMaterno)
                                if (persona[0].cred.email !== values.correo) template.email = values.correo
                                Swal.fire({
                                    title: "Desea guardar los cambios?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#3085d6",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Guardar"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        patchAPI(`v1/ModificarPersona/${persona[0].IdPersona}`, template)
                                            .then((res) => {
                                                if (res.tipo === 'mensaje') {
                                                    toast.success(res.data, {
                                                        autoClose: 1500,
                                                        position: 'top-right'
                                                    })
                                                    resetForm()
                                                    navigate(0)
                                                    setSubmitting(false);
                                                }
                                            })
                                    } else {
                                        setSubmitting(false)
                                    }
                                });
                            }}
                        >{
                                ({
                                    values,
                                    errors,
                                    isSubmitting,
                                    setFieldValue,
                                    handleSubmit
                                }) => (
                                    <form onSubmit={handleSubmit}>
                                        {

                                            persona.map((index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="mb-3">
                                                            <label htmlFor="nombre" className="form-label" >Nombre</label>
                                                            <input type="text" className={`form-control ${errors.nombre && 'mark_wrong'}`} id="nombre" onChange={(val) => { setFieldValue('nombre', val.target.value) }} value={values.nombre} />
                                                            <p className="eti-err">{errors.nombre}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="aPaterno" className="form-label">Apellido Paterno</label>
                                                            <input type="text" className={`form-control ${errors.aPaterno && 'mark_wrong'}`} id="aPaterno" onChange={(val) => { setFieldValue('aPaterno', val.target.value) }} value={values.aPaterno} />
                                                            <p className="eti-err">{errors.aPaterno}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="aPaterno" className="form-label">Apellido Materno</label>
                                                            <input type="text" className={`form-control ${errors.aMaterno && 'mark_wrong'}`} id="aMaterno" onChange={(val) => { setFieldValue('aMaterno', val.target.value) }} value={values.aMaterno} />
                                                            <p className="eti-err">{errors.aMaterno}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="correo" className="form-label">Correo Electronico</label>
                                                            <input type="email" className={`form-control ${errors.correo && 'mark_wrong'}`} id="correo" onChange={(val) => { setFieldValue('correo', val.target.value) }} value={values.correo} />
                                                            <p className="eti-err">{errors.correo}</p>
                                                        </div>
                                                        <div className="container d-flex justify-content-end">
                                                            <button type="submit" className="btn btn-guardar" disabled={isSubmitting}>Guardar</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </form>
                                )}
                        </Formik>
                    }
                </div>
            </div>
        </div>
    )
}

export default Perfil