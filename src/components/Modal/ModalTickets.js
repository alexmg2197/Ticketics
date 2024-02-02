import { React, useState } from "react";
import './modaltickets.css'
import { Formik } from "formik";
import { postAPI } from "../../utils/useAxios";
import Imprimir from "../Impresion/Imprimir";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

const Ticket = ({vis}) =>{

    const [load, setLoad] = useState(false)

    return (
        <div className={`modal_t ${vis?'d-block':'d-none'}`}>
            {
                load && <Loader />
            }
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <Formik
                        initialValues={{
                            cant: 1,
                        }}
                        validate={values => {
                            const errors = {};
                            if (!values.cant) errors.cant = 'Campo vacio'
                            if (values.cant < 1) errors.cant = 'La cantidad mínima es de 1 ticket'
                            return errors
                        }}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            setLoad(true)
                            for (let index = 1; index <= values.cant; index++) {
                                Imprimir()                                     
                            }
                            setLoad(false)
                            
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
                                        <div className="modal-body">
                                            <div className=" w-100">
                                                <div className="m-2 row w-100">
                                                    <div className="col-lg-6 col-12 col-md-12 mb-3">
                                                        <label htmlFor="persona" className="form-label " placeholder="Persona que Notifica">Cantidad de tickets</label>
                                                    </div>
                                                    <div className="col-lg-6 col-12 col-md-12">
                                                        <input type="text" className={`form-control ${errors.cant && 'mark_wrong'}`} id="cant" onChange={(val) => { setFieldValue('cant', val.target.value) }} value={values.cant} />
                                                        <p className="eti-err">{errors.cant}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }                                    
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-cerrar" data-bs-dismiss="modal" onClick={() => { vis(false) }}>Cerrar</button>
                                        <button type="submit" className="btn btn-g" disabled={isSubmitting}>Imprimir</button>
                                    </div>
                                </form>
                            )}</Formik>
                </div>
            </div>
        </div>
    )
}

export default Ticket