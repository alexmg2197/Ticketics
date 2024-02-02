import { React, useState, useEffect } from "react";
import { getAPI, postAPI } from "../../utils/useAxios";
import { toast } from "react-toastify";
import './registro.css'
import { Formik } from "formik";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Registro = ({ setInicio, auth }) => {

    const [areas, setAreas] = useState([])

    useEffect(() => {
        getAPI('v1/ListAreas')
            .then((response) => {
                const ap = response.data
                // const aux = response.data.map((e, index) => {
                //     const q = []
                //     if (e.Clave !== 'G' && e.Clave !== 'RC') {
                //         q.push(index)
                //     }
                //     return q
                // })
                // aux.forEach((element, index) => {
                //     if (element[0] === undefined) {
                //         delete ap[index]
                //     }
                // });
                setAreas(ap)

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
        <div className="fondo-registro">
            <div>
                <Navbar auth={auth} />
            </div>
            <div className="p-3">
                <h1 className="text-center">Registro de Usuario</h1>
            </div>
            <div className="container w-50 d-flex justify-content-center border p-5">
                <div className="row w-100 ">
                    <Formik
                        initialValues={{
                            nombre: '',
                            ap: '',
                            am: '',
                            username: '',
                            password: '',
                            cpsw: '',
                            email: '',
                            areaT: '',
                            areaN: '',
                            rol: '',
                            dis: ''
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.nombre) {
                                errors.nombre = 'Este campo es obligatorio'
                            } else if (!/^[a-zA-Z\s]*$/.test(values.nombre)) { errors.nombre = 'Nombre no valido' }
                            if (!values.ap) {
                                errors.ap = 'Este campo es obligatorio'
                            } else if (!/^[a-zA-Z]*$/.test(values.ap)) { errors.ap = 'Apellido Paterno no Valido' }
                            if (!values.am) {
                                errors.am = 'Este campo es obligatorio'
                            } else if (!/^[a-zA-Z]*$/.test(values.am)) { errors.am = 'Apellido Materno no valido' }
                            if (!values.username) errors.username = 'Este campo es obligatorio'
                            if (!values.password) {
                                errors.password = 'Este campo es obligatorio'
                            } else if (values.password.length < 8) {
                                errors.password = 'La contraseña debe tener un mino de 8 caracteres'
                            }
                            if (!values.cpsw) {
                                errors.cpsw = 'Este campo es obligatorio'
                            } else if (values.cpsw.length < 8) {
                                errors.cpsw = 'La contraseña debe tener un mino de 8 caracteres'
                            }
                            if (values.password !== values.cpsw) errors.cpsw = 'No coinciden las contraseñas'
                            if (!values.email) {
                                errors.email = 'Este campo es obligatorio'
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) { errors.email = 'Correo no valido' }
                            if (!values.areaT) errors.areaT = 'Este campo es obligatorio'
                            if (!values.rol) errors.rol = 'Este campo es obligatorio'
                            if (!values.dis || values.dis==='Seleccionar') errors.dis = 'Este campo es obligatorio'

                            return errors
                        }}
                        onSubmit={(values, { resetForm }) => {
                            const user = {
                                'username': values.username,
                                'email': values.email,
                                'password': values.password
                            }
                            postAPI('v1/CrearUsuario', user)
                                .then((id) => {
                                    let idA = null
                                    areas.map((ar) => {
                                        if (ar.Nombre === values.areaT) {
                                            idA = ar.IdArea
                                        }
                                        return idA
                                    })
                                    const persona = {
                                        'Nombre': replace(values.nombre),
                                        'ApellidoP': replace(values.ap),
                                        'ApellidoM': replace(values.am),
                                        'Rol': replace(values.rol),
                                        'Distrito': values.dis,
                                        'AreaId': idA,
                                        'user': id
                                    }
                                    postAPI('v1/CrearPersona', persona)
                                        .then((res) => {
                                            toast.success('Cuenta Creada', {
                                                autoClose: 1500,
                                                position: 'top-right'
                                            })
                                        })
                                })
                                .finally(() => {
                                    toast.success('Cuenta Creada', {
                                        autoClose: 1500,
                                        position: 'top-right'
                                    })
                                    resetForm()
                                })
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
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <div className="mb-1">
                                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                                <input type="text" className={`form-control ${errors.nombre && 'mark_wrong'}`} id="nombre" placeholder="Ingresar Nombre" onChange={(val) => { setFieldValue('nombre', val.target.value) }} value={values.nombre} />
                                                <p className="eti-err">{errors.nombre}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="ap" className="form-label">Apellido Paterno</label>
                                                <input type="text" className={`form-control ${errors.ap && 'mark_wrong'}`} id="ap" placeholder="Ingresar Apellido Paterno" onChange={(val) => { setFieldValue('ap', val.target.value) }} value={values.ap} />
                                                <p className="eti-err">{errors.ap}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="am" className="form-label">Apellido Materno</label>
                                                <input type="text" className={`form-control ${errors.am && 'mark_wrong'}`} id="am" placeholder="Ingresar Apellido Materno" onChange={(val) => { setFieldValue('am', val.target.value) }} value={values.am} />
                                                <p className="eti-err">{errors.am}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="email" className="form-label">Correo Electronico</label>
                                                <input type="email" className={`form-control ${errors.email && 'mark_wrong'}`} id="email" placeholder="Ingresar Correo Electronico" onChange={(val) => { setFieldValue('email', val.target.value) }} value={values.email} />
                                                <p className="eti-err">{errors.email}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="distrito" className="form-label">Distrito</label>
                                                <select id="distrito" className={`form-select ${errors.dis && 'mark_wrong'}`} onChange={(val) => { setFieldValue('dis', val.target.value) }} value={values.dis} >
                                                    <option key="0" value="Seleccionar">---Selecciona un Distrito---</option>
                                                    <option key="1" value="Pachuca">Pachuca de Soto</option>
                                                    <option key="2" value="Huejutla">Huejutla de Reyes</option>
                                                    <option key="3" value="Tula">Tula de Allende</option>
                                                    <option key="4" value="Tulancingo">Tulancingo de Bravo</option>
                                                </select>
                                                <p className="eti-err">{errors.dis}</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-1">
                                                <label htmlFor="username" className="form-label">Usuario</label>
                                                <input type="text" className={`form-control ${errors.username && 'mark_wrong'}`} id="username" placeholder="Ingresar Usuario" onChange={(val) => { setFieldValue('username', val.target.value) }} value={values.username} />
                                                <p className="eti-err">{errors.username}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="password" className="form-label">Contraseña</label>
                                                <input type="password" className={`form-control ${errors.password && 'mark_wrong'}`} id="password" placeholder='Ingresar Contraseña' onChange={(val) => { setFieldValue('password', val.target.value) }} value={values.password} />
                                                <p className="eti-err">{errors.password}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="cpsw" className="form-label">Confirmar Contraseña</label>
                                                <input type="password" className={`form-control ${errors.cpsw && 'mark_wrong'}`} id="cpsw" placeholder='Confirmar Contraseña' onChange={(val) => { setFieldValue('cpsw', val.target.value) }} value={values.cpsw} />
                                                <p className="eti-err">{errors.cpsw}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="areaT" className="form-label">Area</label>
                                                <select className={`form-select ${errors.areaT && 'mark_wrong'}`} id="areaT" onChange={(val) => { setFieldValue('areaT', val.target.value) }} value={values.areaT} >
                                                    <option key='0' value='null'>---Selecciona una Area---</option>
                                                    {
                                                        areas.map((area) => {
                                                            return (
                                                                <option key={area.IdArea} value={area.Nombre}>{area.Nombre}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <p className="eti-err">{errors.area}</p>
                                            </div>
                                            <div className="mb-1">
                                                <label htmlFor="rol" className="form-label">Rol</label>
                                                <select id="rol" className={`form-select ${errors.rol && 'mark_wrong'}`} onChange={(val) => { setFieldValue('rol', val.target.value) }} value={values.rol} >
                                                    <option key="0" value="Seleccionar">---Selecciona un Rol---</option>
                                                    <option key="1" value="General">General</option>
                                                    <option key="2" value="Admin">Admin</option>
                                                    <option key="3" value="Recepcion">Recepcion</option>
                                                    <option key="4" value="Guardia">Guardia</option>
                                                    <option key="5" value="Monitoreo">Monitor</option>
                                                </select>
                                                <p className="eti-err">{errors.rol}</p>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="d-boton d-grid gap-2">
                                        <button type="submit" className="btn btn_is" disabled={isSubmitting}>
                                            Registrar
                                        </button>
                                    </div>
                                </form>
                            )
                        }

                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default Registro