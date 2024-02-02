import { React, useState, useEffect } from "react";
import './modalPanel.css';
import { getAPI, patchAPI, postAPI } from "../../utils/useAxios";
import Swal from "sweetalert2";
import { Formik } from "formik";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from 'jwt-decode'

const ModalPanel = ({ modal, edit, pause }) => {

    const [areas, setAreas] = useState([])
    const [distritos, setDistritos] = useState([])
    const [agencias, setAgencias] = useState([])
    const [modulos, setModulos] = useState([])
    const [personas, setPersonas] = useState([])
    const [selectedDistritos, setSelectedDistritos] = useState('');
    const [selectedAgencias, setSelectedAgencias] = useState('');
    const [selectedModulos, setSelectedModulos] = useState('');
    const [selectpersonas, setSelectPersonas] = useState('');
    const [selectareas, setSelectAreas] = useState('');
    const [load, setLoad] = useState(true) 
    const [b_report, setB_report] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        getAPI('v1/ListAreas')
            .then((response) => {
                setAreas(response.data)
                setLoad(false)
            })
        getAPI('v1/ListDistritos')
            .then((response) => {
                setDistritos(response.data)
                setSelectedDistritos(edit.mod.age.dis.IdDistrito)
                setB_report(edit.IdReporte)
                setLoad(false)
            })
    }, [])

    useEffect(() => {
        if (selectedDistritos) {
            if(selectedDistritos!=='seleccionar'){
                setLoad(true)
                getAPI(`v1/AgenciaByDistrito/${selectedDistritos}`)
                    .then((response) => {
                        setAgencias(response.data)
                        setSelectedAgencias(edit.mod.age.IdAgencia)
                        setLoad(false)
                    })
            }
        }
    }, [selectedDistritos]);

    useEffect(() => {
        if (selectedAgencias) {
            if(selectedAgencias!=='seleccionar'){
                setLoad(true)
                getAPI(`v1/ModuloByAgencia/${selectedAgencias}`)
                    .then((response) => {
                        setModulos(response.data)
                        setSelectAreas(edit.per.area.IdArea)
                        setLoad(false)
                    })
            }
        }
    }, [selectedAgencias]);

    useEffect(() => {
        if (selectareas) {
            if(selectareas!=='seleccionar'){
                setLoad(true)
                getAPI(`v1/PersonaByArea/${selectareas}`)
                    .then((response) => {
                        setPersonas(response.data)
                        setLoad(false)
                    })
            }
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
                        <h5 className="modal-title" id="exampleModalLabel">Editar Reporte</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { modal(false) }}></button>
                    </div>
                    <Formik
                        initialValues={{
                            txtProblema: edit.Descripcion,
                            txtObser: edit.Observaciones,
                            pd1: edit.mod.age.dis.IdDistrito,
                            pd2: edit.mod.age.IdAgencia,
                            pd3: edit.mod.IdModulo,
                            pd4: edit.PersonaS,
                            pd5: edit.per.area.IdArea,
                            pd6: edit.per.IdPersona,
                            pd7: edit.Prioridad,
                            txtMot: ''
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.txtProblema || values.txtProblema.length === 0) errors.txtProblema = 'Campo vacio'
                            if (!values.txtObser || values.txtObser.length === 0) errors.txtObser = 'Campo vacio'
                            if (!values.pd1 || values.pd1 === 'seleccionar') errors.pd1 = 'Campo vacio'
                            if (!values.pd2 || values.pd2 === 'seleccionar') errors.pd2 = 'Campo vacio'
                            if (!values.pd3 || values.pd3 === 'seleccionar') errors.pd3 = 'Campo vacio'
                            if (!values.pd4) errors.pd4 = 'Campo vacio'
                            if (!values.txtMot) errors.txtMot = 'Campo vacio'
                            if (!values.pd5 || values.pd5 === 'seleccionar') errors.pd5 = 'Campo vacio'
                            if (!values.pd6 || values.pd6 === 'seleccionar') errors.pd6 = 'Campo vacio'
                            if (!values.pd7 || values.pd7 === 'seleccionar') errors.pd7 = 'Campo vacio'
                            return errors
                        }}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const template = {
                                'Descripcion': values.txtProblema,
                                'Observaciones': values.txtObser,
                                'Prioridad': values.pd7,
                                'PersonaS': values.pd4,
                                'PersonaId': values.pd6,
                                'ModuloId': values.pd3
                            }
                            Swal.fire({
                                title: "¿Desea guardar los cambios?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Guardar"
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    patchAPI(`v1/ModificarReporte/${b_report}`, template)
                                    .then((res) => {
                                        if (res.tipo === 'mensaje') {
                                            toast.success(res.data, {
                                                autoClose: 1500,
                                                position: 'top-right'
                                            })
                                            var ui = jwtDecode(localStorage.getItem('access_Token'))
                                            getAPI(`v1/PersonaByUser/${ui.user_id}`)
                                                .then((uidm)=>{
                                                    const RegOpe = {
                                                        'ReporteId': b_report,
                                                        'PersonaId': uidm.data[0].IdPersona,
                                                        'Tipo': 'Modificar',
                                                        'Motivo': values.txtMot
                                                    }
                                                    postAPI('v1/RegistrarOpe',RegOpe)
                                                        .then((reg)=>{
                                                            if(reg?.tipo === 'mensaje'){
                                                                toast.success(reg.data, {
                                                                    autoClose: 1500,
                                                                    position: 'top-right'
                                                                })
                                                            }else if(reg?.tipo === 'error'){
                                                                toast.error(reg?.mensaje, {
                                                                    autoClose: 1500,
                                                                    position: 'top-right'
                                                                })
                                                            }
                                                        })
                                                        .finally(()=>{
                                                            pause(false)
                                                            resetForm()
                                                            modal(false)
                                                            navigate(0)
                                                            setSubmitting(false);
                                                        })
                                                })
                                        }
                                    })
                                }else{
                                    setSubmitting(false)
                                }
                              });                            
                        }}
                    >{
                            ({
                                values,
                                errors,
                                isSubmitting,
                                touched,
                                handleChange,
                                handleReset,
                                resetForm,
                                setFieldValue,
                                handleSubmit
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className=" w-100">
                                            <div className="m-2 row w-100">
                                                <div className='form-floating mb-3'>
                                                    <textarea className='form-control h-100' placeholder="Escriba el problema" id="txtProblema" onChange={(val) => { setFieldValue('txtProblema', val.target.value); }} value={values.txtProblema}></textarea>
                                                    <label htmlFor="txtProblema">Problema</label>
                                                    <p className="eti-err">{errors.txtProblema}</p>
                                                </div>
                                                <div className='form-floating mb-3'>
                                                    <textarea className='form-control h-100' placeholder="Escriba las observaciones" id="txtO" onChange={(val) => { setFieldValue('txtObser', val.target.value); }} value={values.txtObser}></textarea>
                                                    <label htmlFor="txtO">Observaciones</label>
                                                    <p className="eti-err">{errors.txtObser}</p>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-1" className="form-label">Distrito que Notifica</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <select id="pd-1" className={`form-select ${errors.pd1 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd1', val.target.value); setSelectedDistritos(val.target.value); setSelectedAgencias('') }} value={values.pd1}>
                                                        <option key='d0' value='seleccionar'>---Selecciona un Distrito---</option>
                                                        {
                                                            distritos.map((distrito) => {
                                                                return (
                                                                    <option key={distrito.IdDistrito} value={distrito.IdDistrito}>{distrito.Distrito}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <p className="eti-err">{errors.pd1}</p>
                                                </div>
                                            </div>
                                            <div className="m-2 row w-100">
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-2" className="form-label">Agencia que Notifica</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <select id="pd-2" className={`form-select ${errors.pd2 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd2', val.target.value); setSelectedAgencias(val.target.value); setSelectedModulos('') }} value={values.pd2}>
                                                        <option key='a0' value='seleccionar'>--Selecciona una Agencia---</option>
                                                        {
                                                            agencias.map((agencia) => {
                                                                return (
                                                                    <option key={agencia.IdAgencia} value={agencia.IdAgencia}>{agencia.Agencia}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <p className="eti-err">{errors.pd2}</p>
                                                </div>
                                            </div>
                                            <div className="m-2 row w-100">
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-3" className="form-label">Modulo que Notifica</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <select id="pd-3" className={`form-select ${errors.pd3 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd3', val.target.value); setSelectedModulos(val.target.value) }} value={values.pd3}>
                                                        <option key='m0' value='seleccionar'>---Selecciona un Modulo---</option>
                                                        {
                                                            modulos.map((modulo) => {
                                                                return (
                                                                    <option key={modulo.IdModulo} value={modulo.IdModulo}>{modulo.Modulo}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <p className="eti-err">{errors.pd3}</p>
                                                </div>
                                            </div>
                                            <div className="m-2 row w-100">
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-4" className="form-label " placeholder="Persona que Notifica">Persona que Notifica</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <input type="text" className={`form-control ${errors.pd4 && 'mark_wrong'}`} id="pd-4" aria-describedby="emailHelp" onChange={(val) => { setFieldValue('pd4', val.target.value) }} value={values.pd4} />
                                                    <p className="eti-err">{errors.pd4}</p>
                                                </div>
                                            </div>
                                            <div className="m-2 row w-100">
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-5" className="form-label">Area</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <select id="pd-5" className={`form-select ${errors.pd5 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd5', val.target.value); setSelectAreas(val.target.value); setSelectPersonas('') }} value={values.pd5}>
                                                        <option key='aa0' value='seleccionar'>---Selecciona un Area---</option>
                                                        {
                                                            areas.map((area) => {
                                                                return (
                                                                    <option key={area.IdArea} value={area.IdArea}>{area.Nombre}</option>
                                                                )
                                                            })}
                                                    </select>
                                                    <p className="eti-err">{errors.pd5}</p>
                                                </div>
                                            </div>
                                            <div className="m-2 row w-100">
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-6" className="form-label">Responsable</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <select id="pd-6" className={`form-select ${errors.pd6 && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('pd6', val.target.value); setSelectPersonas(val.target.value) }} value={values.pd6}>
                                                        <option key='p0' value='seleccionar'>---Selecciona un Responsable---</option>
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
                                                <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                    <label htmlFor="pd-7" className="form-label">Prioridad</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <select id="pd-7" className={`form-select ${errors.pd7 && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('pd7', val.target.value) }} value={values.pd7}>
                                                        <option value='seleccionar'>---Selecciona la Prioridad---</option>
                                                        <option value="Normal">Normal</option>
                                                        <option value="Urgente">Urgente</option>
                                                        <option value="Muy Urgente">Muy Urgente</option>
                                                    </select>
                                                    <p className="eti-err">{errors.pd7}</p>
                                                </div>
                                            </div>
                                            <div className='form-floating mb-3'>
                                                <textarea className='form-control h-100' placeholder="Escriba el problema" id="txtMot" onChange={(val) => { setFieldValue('txtMot', val.target.value); }} value={values.txtMot}></textarea>
                                                <label htmlFor="txtMot">Motivo de edición</label>
                                                <p className="eti-err">{errors.txtMot}</p>
                                            </div>
                                        </div>
                                    </div>
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

export default ModalPanel