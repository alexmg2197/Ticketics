import { React, useState, useEffect } from "react";
import './generarReporte.css';
import { getAPI, postAPI } from "../../utils/useAxios";
import Navbar from "../Navbar/Navbar";
import { Formik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import ImprimirPDF from "../Impresion/imprimirPDF";
import Imprimir from "../Impresion/Imprimir";
import { jwtDecode } from 'jwt-decode'
import Loader from "../Loader/Loader";

const GenerarReporte = ({ auth, user }) => {

    const [areas, setAreas] = useState(null)
    const [b_year, setB_Year] = useState(null)
    const [b_Nf, setB_Nf] = useState(null)
    const [b_area, setB_Area] = useState(null)
    const [idDistrito, setIdDistrito] = useState(null)
    const [idAgencia, setIdAgencia] = useState(null)
    const [idPersona, setIdPersona] = useState(null)
    const [idModulo, setIdModulo] = useState(null)
    const [desc, setDesc] = useState('')
    const [b_clave, setB_Clave] = useState(null)
    const [b_agencias, setB_agencias] = useState(null)
    const [b_modulos, setB_modulos] = useState(null)
    const [b_personas, setB_personas] = useState(null)
    const [problemas, setProblemas] = useState(null)
    const [prob, setProb] = useState(null)
    const [distritos, setDistritos] = useState([])
    const [load, setLoad] = useState(true)

    useEffect(() => {
        getAPI('v1/ListProblemas')
            .then((response) => {
                setProblemas(response.data)
            })
        getAPI('v1/ListDistritos')
            .then((district) => {
                setDistritos(district.data)
                setLoad(false)
            })   
        getAPI('v1/ListReportes')
            .then((con) => {
                if(con.data.length !== 0){
                    let ix = con.data[0].Folio.split('-')
                    setB_Year(parseInt(ix[0]))
                    setB_Nf(con.data[0].ContF)
                }else{
                    setB_Year(new Date().getFullYear())
                    setB_Nf(0)
                }
                setLoad(false)
            })     
    }, [])

    useEffect(() => {
        if (prob !== null && prob !== 'null') {
            setLoad(true)
            if (prob !== '2') {
                getAPI(`v1/ProblemaById/${prob}`)
                    .then((resP) => {
                        setDesc(resP.data.Descripcion)
                        return resP.data.AreaId
                    })
                    .then((idP) => {
                        if (user === 'Guardia') {
                            getAPI(`v1/AreaById/93544254-99f6-4bd5-bd22-a6369ebf0cde`)
                                .then((resA) => {
                                    setLoad(false)
                                    setB_Area('93544254-99f6-4bd5-bd22-a6369ebf0cde')
                                    setAreas(resA.data)
                                })
                        } else {
                            getAPI(`v1/AreaById/${idP}`)
                                .then((resA) => {
                                    setLoad(false)
                                    setB_Area(idP)
                                    setAreas(resA.data)
                                })
                        }
                    })
            } else {
                setLoad(true)
                if (user === 'Guardia') {
                    getAPI(`v1/AreaById/93544254-99f6-4bd5-bd22-a6369ebf0cde`)
                        .then((resA) => {
                            setLoad(false)
                            setB_Area('93544254-99f6-4bd5-bd22-a6369ebf0cde')
                            setAreas(resA.data)
                        })
                } else {
                    getAPI('v1/ListAreas')
                        .then((bArea) => {
                            setLoad(false)
                            setAreas(bArea.data)
                        })
                }
            }
        }
    }, [prob])

    useEffect(() => {
        if (idDistrito !== null && idDistrito !== 'null') {
            setLoad(true)
            getAPI(`v1/AgenciaByDistrito/${idDistrito}`)
                .then((agency) => {
                    setB_agencias(agency.data)
                    setLoad(false)
                })
        }
    }, [idDistrito])

    useEffect(() => {
        if (idAgencia !== null && idAgencia !== 'null') {
            setLoad(true)
            getAPI(`v1/ModuloByAgencia/${idAgencia}`)
                .then((mod) => {
                    setB_modulos(mod.data)
                    setLoad(false)
                })
        }
    }, [idAgencia])

    useEffect(() => {
        if (b_area !== null && b_area !== 'null') {
            setLoad(true)
            if (areas !== null && areas !== 'null') {
                let are = ''
                if (areas.length > 0) {
                    areas.map((ar) => {
                        if (ar.IdArea === b_area) {
                            are = ar.Clave
                        }
                        return are
                    })
                } else {
                    are = areas.Clave
                }
                setB_Clave(are)
            }
            getAPI(`v1/PersonaByArea/${b_area}`)
                .then((people) => {
                    setB_personas(people.data)
                    setLoad(false)
                })
        }
    }, [b_area])

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
        <div className="fondo-GR">
            <Navbar auth={auth} />
            <ToastContainer />
            {
                load && <Loader />
            }
            <div className=" container flex-colum align-items-start pt-3 cont-generar">
                <div className="container w-100 ">
                    <h1 className="text-center">Generar Reporte</h1>
                    <Formik
                        initialValues={{
                            problema: '',
                            txtProblema: '',
                            txtObser: '',
                            pd1: '',
                            pd2: '',
                            pd3: '',
                            pd4: '',
                            pdTC: '',
                            pd5T: '',
                            pd5N: '',
                            pd6: '',
                            pd7: '',
                            che: false
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.problema) errors.problema = 'Campo vacio'
                            if (!values.txtProblema && prob === '2') errors.txtProblema = 'Campo vacio'
                            if (!values.pd1 || values.pd1 === 'null') errors.pd1 = 'Campo vacio'
                            if (!values.pd2 || values.pd2 === 'null') errors.pd2 = 'Campo vacio'
                            if (!values.pd3 || values.pd3 === 'null') errors.pd3 = 'Campo vacio'
                            if (!values.txtObser) errors.txtObser = 'Campo vacio'
                            if (!values.pd4) errors.pd4 = 'Campo vacio'
                            if (!values.pdTC) { errors.pdTC = 'Campo vacio' }
                            else {
                                if (values.pdTC.length > 10) { errors.pdTC = 'Formato invalidao (debe contener 10 digitos)' }
                                else if (!/^[0-9]+$/.test(values.pdTC)) errors.pdTC = 'Formato invalido (no debe contener letras)'
                            }
                            if (areas === null && areas === 'null' && !values.pd5T) errors.pd5T = 'Campo vacio'
                            if (b_personas === null && b_personas === 'null' || !values.pd6  || values.pd6 === 'Seleccionar') errors.pd6 = 'Campo vacio'
                            if (!values.pd7 || values.pd7 === 'null') errors.pd7 = 'Campo vacio'
                            return errors
                        }}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            var year = new Date().getFullYear();                           
                                
                                const report = {
                                    'Folio': `${year === b_year ? b_year : year}-${b_clave}-${year === b_year ? b_Nf + 1 : 1}`,
                                    'Descripcion': replace(desc),
                                    'Observaciones': replace(values.txtObser),
                                    'FechaF': null,
                                    'HoraF': null,
                                    'Prioridad': values.pd7,
                                    'PersonaS': replace(values.pd4),
                                    'Contacto': values.pdTC,
                                    'Estatus': 'Iniciado',
                                    'PersonaId': user !== 'Guardia' ? idPersona : b_personas[0].IdPersona,
                                    'ModuloId': idModulo,
                                    'ContF': b_Nf + 1
                                }

                            var ui = jwtDecode(localStorage.getItem('access_Token'))

                            getAPI(`v1/PersonaByUser/${ui.user_id}`)
                                .then((idu)=>{
                                    postAPI('v1/CrearReporte', report)
                                        .then((repor) => {
                                            if (repor.tipo === 'mensaje') {                                        
                                                const RegOpe = {
                                                    'ReporteId': repor.id.IdReporte,
                                                    'PersonaId': idu.data[0].IdPersona,
                                                    'Tipo': 'Crear',
                                                    'Motivo': 'Reporte Nuevo'
                                                }
                                                postAPI('v1/RegistrarOpe', RegOpe)
                                                    .then((reg) => {
                                                        if (reg?.tipo === 'mensaje') {
                                                            toast.success(reg.data, {
                                                                autoClose: 1500,
                                                                position: 'top-right'
                                                            })
                                                        } else if (reg?.tipo === 'error') {
                                                            toast.success(reg?.mensaje, {
                                                                autoClose: 1500,
                                                                position: 'top-right'
                                                            })
                                                        }
                                                    })
                                                toast.success(repor.data, {
                                                    autoClose: 1500,
                                                    position: 'top-right'
                                                })
                                            } else if (repor.tipo === 'error') {
                                                toast.error(repor.mensaje, {
                                                    autoClose: 1500,
                                                    position: 'top-right'
                                                })
                                            }

                                            return repor.id
                                        })
                                        .then((rId) => {
                                            if(!values.che){
                                                getAPI(`v1/ReporteById/${rId.IdReporte}`)
                                                    .then((pI) => {
                                                        Imprimir(pI.data[0])
                                                        // ImprimirPDF(pI.data[0])
                                                    })
                                            }
                                        })
                                        .finally((mes) => {
                                            resetForm()
                                            setAreas(null)
                                            setSubmitting(false);
                                        })
                                })                            

                            setSubmitting(false);
                        }}
                    >{
                            ({
                                values,
                                errors,
                                touched,
                                isSubmitting,
                                setFieldValue,
                                handleSubmit
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="container w-100 problema border ">
                                        <div className="m-2 row">
                                            <div className="col-lg-4 col-12 col-md-6">
                                                <label htmlFor="problema" className="form-label">Problema Reportado</label>
                                                <select id="problema" className={`form-select ${errors.problema && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('problema', val.target.value); setProb(val.target.value) }} value={values.problema}>
                                                    <option value='null'>---Seleccione un Problema---</option>
                                                    {
                                                        problemas !== null &&
                                                        problemas.map((problema) => {
                                                            return (
                                                                <option key={problema.IdProblema} value={problema.IdProblema}>{problema.Descripcion}</option>
                                                            )
                                                        })
                                                    }
                                                    <option value="2">Otro</option>
                                                </select>
                                                <p className="eti-err">{errors.problema}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (prob !== null && prob !== 'null') &&
                                        <div className="otro container w-100 border">
                                            <div className="m-2 row">
                                                <div className={`form-floating mb-3 ${prob !== "2" ? 'd-none' : ''}`}>
                                                    <textarea className={`form-control h-100 ${errors.txtProblema && 'mark_wrong'}`} placeholder="Escriba el problema" id="txtProblema" onChange={(val) => { setFieldValue('txtProblema', val.target.value); setDesc(val.target.value) }} value={values.txtProblema}></textarea>
                                                    <label htmlFor="txtProblema">Problema</label>
                                                    <p className="eti-err">{errors.txtProblema}</p>
                                                </div>
                                                <div className={`form-floating mb-3 mt-3`}>
                                                    <textarea className={`form-control h-100 ${errors.txtObser && 'mark_wrong'}`} placeholder="Escriba el problema" id="txtObserv" onChange={(val) => { setFieldValue('txtObser', val.target.value) }} value={values.txtObser}></textarea>
                                                    <label htmlFor="txtObserv">Observaciones</label>
                                                    <p className="eti-err">{errors.txtObser}</p>
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6 mb-3 mt-3">
                                                    <label htmlFor="pd-1" className="form-label">Distrito que Notifica</label>
                                                    <select id="pd-1" className={`form-select ${errors.pd1 && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('pd1', val.target.value); setIdDistrito(val.target.value) }} value={values.pd1}>
                                                        <option key='0' value='null'>---Selecciona un Distrito---</option>
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
                                                <div className="col-lg-4 col-12 col-md-6  mt-3">
                                                    <label htmlFor="pd-2" className="form-label">Agencia que Notifica</label>
                                                    <select id="pd-2" className={`form-select ${errors.pd2 && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('pd2', val.target.value); setIdAgencia(val.target.value) }} value={values.pd2}>
                                                        <option value='null'>--Selecciona una Agencia---</option>
                                                        {
                                                            b_agencias !== null && (
                                                                b_agencias.map((agen) => {
                                                                    return (
                                                                        <option key={agen.IdAgencia} value={agen.IdAgencia}>{agen.Agencia}</option>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </select>
                                                    <p className="eti-err">{errors.pd2}</p>
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6  mt-3">
                                                    <label htmlFor="pd-3" className="form-label">Modulo que Notifica</label>
                                                    <select id="pd-3" className={`form-select ${errors.pd3 && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('pd3', val.target.value); setIdModulo(val.target.value) }} value={values.pd3}>
                                                        <option value='null'>---Selecciona un Modulo---</option>
                                                        {
                                                            b_modulos !== null && (
                                                                b_modulos.map((mo) => {
                                                                    return (
                                                                        <option key={mo.IdModulo} value={mo.IdModulo}>{mo.Modulo}</option>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </select>
                                                    <p className="eti-err">{errors.pd3}</p>
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6 mb-3">
                                                    <label htmlFor="pd-4" className="form-label" placeholder="Persona que Notifica">Persona que Notifica</label>
                                                    <input type="text" className={`form-control ${errors.pd4 && 'mark_wrong'}`} id="pd-4" aria-describedby="emailHelp" onChange={(val) => { setFieldValue('pd4', val.target.value) }} value={values.pd4} />
                                                    <p className="eti-err">{errors.pd4}</p>
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6 mb-3">
                                                    <label htmlFor="pdTC" className="form-label" placeholder="Persona que Notifica">Teléfono para contacto</label>
                                                    <input type="Tel" className={`form-control ${errors.pdTC && 'mark_wrong'}`} id="pdTC" onChange={(val) => { setFieldValue('pdTC', val.target.value) }} value={values.pdTC} />
                                                    <p className="eti-err">{errors.pdTC}</p>
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6">
                                                    <label htmlFor="pd-5T" className="form-label">Area</label>
                                                    {
                                                        areas !== null && (
                                                            user !== 'Guardia'
                                                                ? (
                                                                    areas.length > 0
                                                                        ? (
                                                                            <select id="pd-5T" className={`form-select ${errors.pd5T && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd5T', val.target.value); setB_Area(val.target.value); }} value={values.pd5T}>
                                                                                <option key='0' value='null'>---Selecciona una Área---</option>
                                                                                {
                                                                                    areas.map((area) => {
                                                                                        return (
                                                                                            <option key={area.IdArea} value={area.IdArea}>{area.Nombre}</option>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </select>
                                                                        )
                                                                        : (
                                                                            <input type="text" className={`form-control ${errors.pd5T && 'mark_wrong'}`} id="pd-5T" onChange={(val) => { setFieldValue('pd5T', val.target.value); }} value={areas === null ? '' : areas.Nombre} disabled />
                                                                        )
                                                                ) : (
                                                                    <input type="text" className={`form-control ${errors.pd5T && 'mark_wrong'}`} id="pd-5T" onChange={(val) => { setFieldValue('pd5T', val.target.value); }} value={areas === null ? '' : user} disabled />
                                                                )
                                                        )
                                                    }
                                                    {(errors.pd5T && touched.pd5T) && (<p className="eti-err">{errors.pd5T}</p>)}
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6">
                                                    <label htmlFor="pd-6" className="form-label">Responsable</label>
                                                    {
                                                        b_personas !== null && (
                                                            // user !== 'Guardia'
                                                            //     ? (
                                                                    <select id="pd-6" className={`form-select ${errors.pd6 && 'mark_wrong'}`} onChange={(val) => { setFieldValue('pd6', val.target.value); setIdPersona(val.target.value) }} value={values.pd6}>
                                                                        <option value='Seleccionar'>---Selecciona un Responsable---</option>
                                                                        {
                                                                            b_personas.map((person) => {
                                                                                if (person.Rol !== 'Admin') {
                                                                                    return (
                                                                                        <option key={person.IdPersona} value={person.IdPersona}>{`${person.Nombre} ${person.ApellidoP} ${person.ApellidoM}`}</option>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                    </select>
                                                                // ) : (
                                                                //     <input type="text" className={`form-control ${errors.pd6 && 'mark_wrong'}`} id="pd-6" onChange={(val) => { setFieldValue('pd6', val.target.value); }} value={b_personas === null ? '' : b_personas[0].Nombre} disabled />
                                                                // )
                                                        )
                                                    }
                                                    {(errors.pd6 || touched.pd6) && (<p className="eti-err">{errors.pd6}</p>)}
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6">
                                                    <label htmlFor="pd-7" className="form-label">Prioridad</label>
                                                    <select id="pd-7" className={`form-select ${errors.pd7 && 'mark_wrong'}`} aria-label="Default select example" onChange={(val) => { setFieldValue('pd7', val.target.value) }} value={values.pd7}>
                                                        <option value='null'>---Selecciona la Prioridad---</option>
                                                        <option value="Normal">Normal</option>
                                                        <option value="Urgente">Urgente</option>
                                                        <option value="Muy Urgente">Muy Urgente</option>
                                                    </select>
                                                    <p className="eti-err">{errors.pd7}</p>
                                                </div>
                                                <div className="col-lg-4 col-12 col-md-6">
                                                    <label htmlFor="pd-7" className="form-label">Ticket existente</label>
                                                    <input type="checkbox" className="form-check-input ms-2" id="check" onChange={(val)=>{setFieldValue('che', val.target.checked)}} checked={values.che}></input>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div className="d-boton d-grid gap-2 justify-content-end">
                                        <button type="submit" className="btn btn_is" disabled={isSubmitting} >
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default GenerarReporte