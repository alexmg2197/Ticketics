import { React, useState, useEffect } from "react";
import './modalPanel.css';
import { patchAPI, postAPI } from "../../utils/useAxios";
import Swal from "sweetalert2";
import { Formik } from "formik";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ModalFinalizar = ({modal, info}) =>{

    const [b_IdRe, setIdRe] = useState()
    const [b_idPe, setB_IdPe] = useState(null)
    const [load, setLoad] = useState(true)
    const navigate = useNavigate();

    useEffect(()=>{
        setIdRe(info.IdReporte)
        setB_IdPe(info.per.IdPersona)
        setLoad(false)
    },[])

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
                            per: '',
                            obser: '',
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.per) errors.per = 'Campo vacio'
                            if (!values.obser) errors.obser = 'Campo vacio'
                            return errors
                        }}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            Swal.fire({
                                title: "Estas seguro de finalizar el reporte??",
                                showCancelButton: true,
                                confirmButtonText: "Finalizar",
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    let fecha = new Date()
                                    let day = `${(fecha.getDate())}`.padStart(2,'0');
                                    let month = `${(fecha.getMonth()+1)}`.padStart(2,'0');
                                    let year = fecha.getFullYear();
                                    const template = {
                                        'PersonaF': values.per,
                                        'Acciones': values.obser,
                                        'FechaF': `${year}-${month}-${day}`,
                                        'HoraF': `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`,
                                        'Estatus': 'Finalizado'
                                    }
                                    patchAPI(`v1/ModificarReporte/${b_IdRe}`, template)
                                        .then((res) => {
                                            if (res.tipo === 'mensaje') {
                                                toast.success('Reporte Finalizado', {
                                                    autoClose: 1500,
                                                    position: 'top-right'
                                                })
                                                const RegOpe = {
                                                    'ReporteId': b_IdRe,
                                                    'PersonaId': b_idPe,
                                                    'Tipo': 'Finalizar',
                                                    'Motivo': 'Reporte concluido'
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
                                                        resetForm()
                                                        modal(false)
                                                        navigate(0)
                                                        setSubmitting(false);
                                                    })
                                            }
                                        })
                                } else{
                                    setSubmitting(false)
                                }
                              });     
                            setSubmitting(false)
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
                                                    <label htmlFor="persona" className="form-label " placeholder="Persona que Notifica">Persona que valida</label>
                                                </div>
                                                <div className="col-lg-6 col-12 col-md-12">
                                                    <input type="text" className={`form-control ${errors.per && 'mark_wrong'}`} id="persona" onChange={(val) => { setFieldValue('per', val.target.value) }} value={values.per} />
                                                    <p className="eti-err">{errors.per}</p>
                                                </div>
                                            </div>
                                            <div className='form-floating mb-3'>
                                                <textarea className='form-control h-100' placeholder="Escriba el problema" id="txtOv" onChange={(val) => { setFieldValue('obser', val.target.value); }} value={values.obser}></textarea>
                                                <label htmlFor="txtOv">Acciones Realizadas</label>
                                                <p className="eti-err">{errors.obser}</p>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                }                                    
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-cerrar" data-bs-dismiss="modal" onClick={() => { modal(false) }}>Cerrar</button>
                                        <button type="submit" className="btn btn-g" disabled={isSubmitting}>Finalizar</button>
                                    </div>
                                </form>
                            )}</Formik>
                </div>
            </div>
        </div >
    )
}

export default ModalFinalizar