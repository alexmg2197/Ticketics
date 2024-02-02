import { React, useState, useEffect } from "react";
import './modalPanel.css';
import { getAPI, patchAPI, postAPI } from "../../utils/useAxios";
import Swal from "sweetalert2";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import { jwtDecode } from 'jwt-decode'
import { toast, ToastContainer } from "react-toastify";

const ModalReportesActuales = ({ modal, info, user }) => {

    const [selectareas, setSelectAreas] = useState('')
    const [selectpersonas, setSelectPersonas] = useState('')
    const [areas, setAreas] = useState([])
    const [b_idR, setB_IdR] = useState(null)
    const [b_idP, setB_IdP] = useState(null)
    const [personas, setPersonas] = useState([])
    const [load, setLoad] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        getAPI('v1/ListAreas')
            .then((response) => {
                if(response?.tipo && response?.tipo === 'error'){
                    toast.error(response?.mensaje,{
                        autoClose: 2000,
                        theme: 'dark',
                        position:'top-right',
                        closeButton: false
                    })
                }else{
                    const ap = response.data    
                    setAreas(ap)
                    setB_IdR(info.IdReporte)
                    setB_IdP(info.per.IdPersona)
                    setSelectAreas(info.per.area.IdArea)
                    setLoad(false)
                }
            })
    }, [])

    useEffect(() => {
        if (selectareas && selectareas !== 'seleccionar') {
            setLoad(false)
            getAPI(`v1/PersonaByArea/${selectareas}`)
                .then((response) => {
                    setPersonas(response.data)
                    setLoad(false)
                })
        }
    }, [selectareas]);

    return (
        <div className="modal" id="exampleModal" aria-labelledby="exampleModalLabel" style={{ display: 'block' }} aria-hidden="true">
            <ToastContainer />
            {
                load && <Loader />
            }
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Reasignar Reporte</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { modal(false) }}></button>
                    </div>
                    <Formik
                        initialValues={{
                            pd5: info.per.area.IdArea,
                            pd6: b_idP,
                            iMot: ''
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.pd5 || values.pd5 === 'seleccionar') errors.pd5 = 'Campo vacio'
                            if (!values.pd6 || values.pd6 === 'seleccionar') errors.pd6 = 'Campo vacio'
                            if (!values.iMot) errors.iMot = 'Campo vacio'
                            return errors
                        }}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const template = {
                                'PersonaId': values.pd6,
                                'AreaId': values.pd5
                            }
                            Swal.fire({
                                title: "¿Estas seguro de realizar la asignación?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Reasignar"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    patchAPI(`v1/ModificarReporte/${b_idR}`, template)
                                        .then((res) => {
                                            if (res?.tipo === 'mensaje') {
                                                toast.success(res.data, {
                                                    autoClose: 1500,
                                                    position: 'top-right'
                                                })
                                                var ui = jwtDecode(localStorage.getItem('access_Token'))
                                                getAPI(`v1/PersonaByUser/${ui.user_id}`)
                                                    .then((uidrr)=>{
                                                        const RegOpe = {
                                                            'ReporteId': b_idR,
                                                            'PersonaId': uidrr.data[0].IdPersona,
                                                            'Tipo': 'Asignar',
                                                            'Motivo': values.iMot
                                                        }
                                                        postAPI('v1/RegistrarOpe',RegOpe)
                                                            .then((reg)=>{
                                                                if(reg?.tipo === 'mensaje'){
                                                                    toast.success(reg.data, {
                                                                        autoClose: 1500,
                                                                        position: 'top-right'
                                                                    })
                                                                }else if(reg?.tipo === 'error'){
                                                                    toast.success(reg?.mensaje, {
                                                                        autoClose: 1500,
                                                                        position: 'top-right'
                                                                    })
                                                                }
                                                            })
                                                            .finally(()=>{
                                                                resetForm()
                                                                modal(false)
                                                                navigate(0)
                                                                setSubmitting(false);
                                                            })
                                                    })
                                            }else if(res?.tipo === 'error'){
                                                toast.error(res?.mensaje, {
                                                    autoClose: 1500,
                                                    position: 'top-right'
                                                })
                                            }
                                        })
                                } else {
                                    modal(false)
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
                                        !load && (
                                            <div className="modal-body">
                                                <div className=" w-100">
                                                    <div className="m-2 row w-100">
                                                        <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                            <label htmlFor="pd-5" className="form-label">Area</label>
                                                        </div>
                                                        <div className="col-lg-6 col-12 col-md-12">
                                                            <select id="pd-5" className={`form-select ${errors.pd5 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd5', val.target.value); setSelectAreas(val.target.value); setSelectPersonas('') }} value={values.pd5}>
                                                                <option key='as' value='seleccionar'>---Selecciona un Area---</option>
                                                                {
                                                                    areas.map((area) => { 
                                                                        return (
                                                                            <option key={area.IdArea} value={area.IdArea}>{area.Nombre}</option>
                                                                        )                                                                                                                            
                                                                    })
                                                                }
                                                            </select>
                                                            <p className="eti-err">{errors.pd5}</p>
                                                        </div>
                                                    </div>

                                                    <div className="m-2 row w-100">
                                                        <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                            <label htmlFor="pd-6" className="form-label">Responsable</label>
                                                        </div>
                                                        <div className="col-lg-6 col-12 col-md-12">
                                                            <select id="pd-6" className={`form-select ${errors.pd6 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd6', val.target.value); setSelectPersonas(val.target.value) }} value={values.pd6!==null?values.pd6:info.per.IdPersona}>
                                                                <option value='seleccionar'>---Selecciona un Responsable---</option>
                                                                {
                                                                    personas.map((persona) => {
                                                                        if (persona.Rol !== "Admin") {
                                                                            return (
                                                                                <option key={persona.IdPersona} value={persona.IdPersona}>{`${persona.Nombre} ${persona.ApellidoP} ${persona.ApellidoM}`}</option>
                                                                            )
                                                                        }

                                                                    })}
                                                            </select>
                                                            <p className="eti-err">{errors.pd6}</p>
                                                        </div>
                                                    </div>
                                                    <div className="m-2 row w-100">
                                                        <div className='form-floating mb-3'>
                                                            <textarea className='form-control h-100' placeholder="Escriba el problema" id="iMot" onChange={(val) => { setFieldValue('iMot', val.target.value); }} value={values.iMot}></textarea>
                                                            <label htmlFor="iMot">Motivo</label>
                                                            <p className="eti-err">{errors.iMot}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-cerrar" data-bs-dismiss="modal" onClick={() => { modal(false) }}>Cerrar</button>
                                        <button type="submit" className="btn btn-g" disabled={isSubmitting}>Guardar Cambios</button>
                                    </div>
                                </form>
                            )}</Formik>
                </div>
            </div>
        </div >
    )
}

export default ModalReportesActuales