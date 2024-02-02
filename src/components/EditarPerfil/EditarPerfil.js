import { React, useState, useEffect } from "react";
import { getAPI, patchAPI } from "../../utils/useAxios";
import './editarperfil.css'
import Navbar from '../Navbar/Navbar'
import { Formik } from "formik";
import Swal from "sweetalert2";
import Loader from "../Loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditarPerfil = ({ auth }) => {

    const usuarioP = {
        "IdPersona": '',
        "Nombre": '',
        "ApellidoP": '',
        "ApellidoM": '',
        "Rol": "General",
        "user": 0,
        "AreaId": ''
    }
    const [areas, setAreas] = useState([])
    const [personas, setPersonas] = useState([])
    const [use, setUse] = useState(usuarioP)
    const [selectedPersona, setSelectedPersona] = useState('');
    const [dataFromApi, setDataFromApi] = useState(null);
    const [aux, setAux] = useState('')
    const [aux2, setAux2] = useState('')
    const [aux3, setAux3] = useState('')
    const [load, setLoad] = useState(true)
    const navigate = useNavigate()


    useEffect(() => {
        getAPI('v1/ListAreas')
            .then((response) => {
                setAreas(response.data)
                setLoad(false)
            })
        getAPI('v1/ListPersonas')
            .then((response) => {
                setLoad(false)
                setPersonas(response.data)
            })
    }, [])

    useEffect(() => {
        if (selectedPersona) {
            getAPI(`v1/PersonaCById/${selectedPersona}`)
                .then((response) => {
                    setDataFromApi(response.data)   
                    setAux(response.data.AreaId)                 
                    setAux2(response.data.Rol)                 
                    setAux3(response.data.Distrito)                 
                    setLoad(false)
                })
        }
    }, [selectedPersona])

    return (
        <div className="fondo-EP">
            {
                load && <Loader />
            }
            <div>
                <ToastContainer />
                <Navbar auth={auth} />
            </div>
            <div className="p-3">
                <h1 className="text-center">Editar Perfil</h1>
            </div>
            <div className="container w-50 d-flex justify-content-center border p-5">
                <div className="row w-100 ">
                        <div className="mb-3">
                            <label htmlFor="persona" className="form-label">Persona</label>
                            <select id="persona" className='form-select' onChange={(val) => { setSelectedPersona(val.target.value) }}>
                                <option key='seleccionar'>---Selecciona una Persona---</option>
                                {
                                    personas.map((persona) => {
                                        return (
                                            <option key={persona.IdPersona} value={persona.IdPersona}>{`${persona.Nombre} ${persona.ApellidoP} ${persona.ApellidoM}`}</option>
                                        )
                                    })}
                            </select>
                        </div>
                    {
                        dataFromApi !== null &&
                        (
                            <Formik
                                initialValues={{
                                    area: aux,
                                    rol: aux2,
                                    dist: aux3
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.area) errors.area = 'Campo vacio'
                                    return errors
                                }}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    const per = {
                                        'Rol': values.rol,
                                        'AreaId': values.area,
                                        'Distrito': values.dist
                                    }
                                    Swal.fire({
                                        title: "¿Esta seguro que los datos son correctos?",
                                        icon: "question",
                                        showCancelButton: true,
                                        cancelButtonColor: "#d33",
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "Si"
                                    })
                                        .then((result) => {
                                            if (result.isConfirmed) {
                                                patchAPI(`v1/ModificarPersona/${dataFromApi.IdPersona}`, per)
                                                    .then((res) => {
                                                        if (res.tipo === 'mensaje') {
                                                            toast.success(res.data, {
                                                                autoClose: 1500,
                                                                position: 'top-right'
                                                            })
                                                            resetForm()
                                                            setSubmitting(false);
                                                            navigate(0)
                                                        }
                                                        else if (res.tipo === 'error') {
                                                            toast.error(res.data, {
                                                                autoClose: 1500,
                                                                position: 'top-right'
                                                            })
                                                        }
                                                    })
                                            }
                                    });
                                    setSubmitting(false);
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
                                                    <div>
                                                        <div className="mb-3">
                                                            <label htmlFor="area" className="form-label">Area</label>
                                                            <select id="area" className={`form-select ${errors.area && 'mark_wrong'}`} onChange={(val) => { setFieldValue('area', val.target.value); setAux(val.target.value)}} value={aux}>
                                                                <option key="0" value='seleccionar'>---Selecciona un Area---</option>
                                                                {
                                                                    areas.map((area) => {
                                                                        return (
                                                                            <option key={area.IdArea} value={area.IdArea}>{area.Nombre}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                            <p className="eti-err">{errors.area}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="rol" className="form-label">Rol</label>
                                                            <select id="rol" className={`form-select ${errors.rol && 'mark_wrong'}`} onChange={(val) => { setFieldValue('rol', val.target.value); setAux2(val.target.value)}} value={aux2} >
                                                                <option key="0" value="Seleccionar">---Selecciona un Rol---</option>
                                                                <option key="1" value="General">General</option>
                                                                <option key="2" value="Admin">Admin</option>
                                                                <option key="3" value="Recepcion">Recepcion</option>
                                                                <option key="4" value="Guardia">Guardia</option>
                                                                <option key="5" value="Monitoreo">Monitor</option>
                                                            </select>
                                                            <p className="eti-err">{errors.rol}</p>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="distrito" className="form-label">Distrito</label>
                                                            <select id="distrito" className={`form-select ${errors.dist && 'mark_wrong'}`} onChange={(val) => { setFieldValue('dist', val.target.value); setAux3(val.target.value)}} value={aux3} >
                                                                <option key="0" value="Seleccionar">---Selecciona un Distrito---</option>
                                                                <option key="1" value="Pachuca">Pachuca de Soto</option>
                                                                <option key="2" value="Huejutla">Huejutla de Reyes</option>
                                                                <option key="3" value="Tula">Tula de Allende</option>
                                                                <option key="4" value="Tulancingo">Tulancingo de Bravo</option>
                                                            </select>
                                                            <p className="eti-err">{errors.dist}</p>
                                                        </div>
                                                    </div>
                                            <div className="container d-flex justify-content-end">
                                                <button type="submit" className="btn btn-guardar" disabled={(values.area !== dataFromApi.AreaId || values.rol !== dataFromApi.Rol || values.dist !== dataFromApi.Distrito) ? isSubmitting : true}>Guardar</button>
                                            </div>
                                        </form>
                                    )}
                            </Formik>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default EditarPerfil