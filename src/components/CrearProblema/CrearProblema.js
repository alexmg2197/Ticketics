import { React, useState, useEffect } from "react";
import { getAPI, postAPI } from "../../utils/useAxios";
import Navbar from "../Navbar/Navbar";
import './crearproblema.css'
import { toast } from "react-toastify";
import { Formik } from "formik";
import Swal from "sweetalert2";

const CrearProblema = ({ auth }) => {

    const [areas, setAreas] = useState([])

    useEffect(() => {
        getAPI('v1/ListAreas')
            .then((response) => {
                setAreas(response.data)
            })
    }, [])

    return (
        <div className="fondo-CP">
            <div>
                <Navbar auth={auth} />
            </div>
            <div>
                <div className="">
                    <div className="p-3">
                        <h1 className="text-center">Crear Problema</h1>
                    </div>
                    <div className="container w-50 d-flex justify-content-center border p-5">
                        <div className="row w-100 ">
                            <Formik
                                initialValues={{
                                    problema: '',
                                    area: '',
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.problema) errors.problema = 'Campo vacio'
                                    if (!values.area) errors.area = 'Campo vacio'
                                    return errors
                                }}
                                onSubmit={(values, { setSubmitting, resetForm }) => {
                                    const prob = {
                                        'Descripcion': values.problema,
                                        'AreaId': values.area,
                                    }
                                    postAPI('v1/CrearProblema', prob)
                                        .then((res) => {
                                            if (res.tipo === 'mensaje') {
                                                toast.success(res.data, {
                                                    autoClose: 1500,
                                                    position: 'top-right'
                                                })
                                            }
                                        })
                                    Swal.fire({
                                        title: "Se ha creado el problema",
                                        icon: "success",
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "Ok"
                                    })
                                        .then((result) => {
                                            if (result.isConfirmed) {
                                                resetForm()
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
                                            <div className="mb-3">
                                                <label htmlFor="problema" className="form-label" >Problema</label>
                                                <input type="text" className={`form-control ${errors.problema && 'mark_wrong'}`} id="problema" onChange={(val) => { setFieldValue('problema', val.target.value) }} value={values.problema} />
                                                <p className="eti-err">{errors.problema}</p>
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="area" className="form-label">Area</label>
                                                <select id="area" className={`form-select ${errors.area && 'mark_wrong'}`} onChange={(val) => { setFieldValue('area', val.target.value) }} value={values.area}>
                                                    <option selected>---Selecciona un Area---</option>
                                                    {
                                                        areas.map((area) => {
                                                            return (
                                                                <option value={area.IdArea}>{area.Nombre}</option>
                                                            )
                                                        })}
                                                </select>
                                                <p className="eti-err">{errors.area}</p>
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
        </div>
    )
}

export default CrearProblema