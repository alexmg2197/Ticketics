import { React, useEffect, useState } from "react";
import { postAPI, getAPI } from "../../utils/useAxios";
import Navbar from "../Navbar/Navbar";
import { toast, ToastContainer } from "react-toastify";
import './creararea.css'
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

const CrearArea = ({ auth }) => {

    const [distritos, setDistritos] = useState('')
    const [agencias, setAgencias] = useState('')
    const [modulos, setModulos] = useState('')
    const [distrito, setDistrito] = useState('')
    const [agencia, setAgencia] = useState('')
    const [modulo, setModulo] = useState('')
    const [iddistrito, setIddistrito] = useState('')
    const [idagencia, setIdagencia] = useState('')
    const [idmodulo, setIdmodulo] = useState('')

    useEffect(()=>{
        getAPI('v1/ListDistritos')
            .then((resD)=>{           
                setDistritos(resD.data)
            })
    },[])

    useEffect(()=>{
        if(distritos !== ''){
            if(distrito!==''){
                distritos.map(di=>{
                    if(di.Distrito === distrito){
                        return setIddistrito(di.IdDistrito)
                    }
                })
            }
        }
        if(iddistrito !== ''){
            getAPI(`v1/AgenciaByDistrito/${iddistrito}`)
                .then((resA)=>{
                    setAgencias(resA.data)
                })
        }
    },[distrito, iddistrito])

    useEffect(()=>{
        if(agencias !== ''){
            if(agencia!==''){
                agencias.map(ag=>{
                    if(ag.Agencia === agencia){
                        return setIdagencia(ag.IdAgencia)
                    }
                })
            }
        }
        if(idagencia !== ''){
            getAPI(`v1/ModuloByAgencia/${idagencia}`)
                .then((resM)=>{
                    setModulos(resM.data)
                })
        }
    },[agencia, idagencia])

    return (
        <div className="fondo-Area">
            <div>
                <Navbar auth={auth} />
                <ToastContainer />
            </div>
            <div className="">
                <div className="p-3">
                    <h1 className="text-center">Crear Area</h1>
                </div>
                <div className="container w-50 d-flex justify-content-center border p-5">
                    <div className="row w-100 ">
                        <Formik
                            initialValues={{
                                distrito: '',
                                agencia: '',
                                modulo: '',
                            }}
                            validate={values => {
                                const errors = {};
                                if (!values.distrito) errors.distrito = 'Campo vacio'
                                if (!values.agencia) errors.agencia = 'Campo vacio'
                                if (!values.modulo) errors.modulo = 'Campo vacio'
                                return errors
                            }}
                            onSubmit={(values, { setSubmitting, resetForm }) => {

                                const areaR = {
                                    'Distrito': values.distrito.toUpperCase(),
                                    'Agencia': values.agencia.toUpperCase(),
                                    'Modulo': values.modulo.toUpperCase()
                                }                                

                                postAPI('v1/CrearAreaReporta', areaR)
                                    .then((res) => {
                                        if (res.tipo === 'mensaje') {
                                            toast.success(res.data, {
                                                autoClose: 1500,
                                                position: 'top-right'
                                            })
                                            setAgencia('')
                                            setAgencias('')
                                            setDistrito('')
                                            setDistritos('')
                                            setModulo('')
                                            setModulos('')
                                            setIdagencia('')
                                            setIddistrito('')
                                            setIdmodulo('')
                                        }
                                    })
                                    .finally((ss)=>{
                                        resetForm()
                                    })
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
                                        <div className="mb-3">
                                            <label htmlFor="distrito" className="form-label" >Distrito</label>
                                            {/* <input type="text" className={`form-control ${errors.distrito && 'mark_wrong'}`} id="distrito" onChange={(val) => { setFieldValue('distrito', val.target.value) }} value={values.distrito} /> */}
                                            <input className={`form-control ${errors.distrito && 'mark_wrong'}`} list="datalistDistrito" id="distrito" placeholder="Escribe el Distrito" onChange={(val) => { setFieldValue('distrito', val.target.value); setDistrito(val.target.value)}}/>
                                                <datalist id="datalistDistrito">
                                                    {                                                        
                                                        distritos !== '' ?
                                                            distritos.map((d, index)=>{
                                                                return <option key = {d.IdDistrito} value={d.Distrito}/>
                                                            })   
                                                        : <option key = '1' value='seleccionar' />
                                                    }
                                                </datalist>
                                            <p className="eti-err">{errors.distrito}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="agencia" className="form-label">Agencia</label>
                                            {/* <input type="text" className={`form-control ${errors.agencia && 'mark_wrong'}`} id="agencia" onChange={(val) => { setFieldValue('agencia', val.target.value) }} value={values.agencia} /> */}
                                            <input className={`form-control ${errors.agencia && 'mark_wrong'}`} list="datalistAgencia" id="agencia" placeholder="Escribe la Agencia" onChange={(val) => { setFieldValue('agencia', val.target.value); setAgencia(val.target.value)}}/>
                                                <datalist id="datalistAgencia">
                                                    {                                                        
                                                        agencias !== '' ?
                                                            agencias.map((a, index)=>{
                                                                return <option key = {a.IdAgencia} value={a.Agencia}/>
                                                            })   
                                                        : <option key = '1' value='seleccionar' />
                                                    }
                                                </datalist>
                                            <p className="eti-err">{errors.agencia}</p>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="modulo" className="form-label">Modulo</label>
                                            {/* <input type="text" className={`form-control ${errors.modulo && 'mark_wrong'}`} id="modulo" onChange={(val) => { setFieldValue('modulo', val.target.value) }} value={values.modulo} /> */}
                                            <input className={`form-control ${errors.modulo && 'mark_wrong'}`} list="datalistModulo" id="modulo" placeholder="Escribe el Modulo" onChange={(val) => { setFieldValue('modulo', val.target.value); setModulo(val.target.value)}}/>
                                                <datalist id="datalistModulo">
                                                    {                                                        
                                                        modulos !== '' ?
                                                            modulos.map((m, index)=>{
                                                                return <option key = {m.IdAgencia} value={m.Agencia}/>
                                                            })   
                                                        : <option key = '1' value='seleccionar' />
                                                    }
                                                </datalist>
                                            <p className="eti-err">{errors.modulo}</p>
                                        </div>
                                        <div className="container d-flex justify-content-end">
                                            <button type="submit" className="btn btn-guardar" disabled={isSubmitting}>Guardar</button>
                                        </div>
                                    </form>
                                )}
                        </Formik>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CrearArea