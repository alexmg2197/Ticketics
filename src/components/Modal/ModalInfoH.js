


const ModalInfoH = ({ modal, info }) => {
    var d = info.FechaI
    var i = d.split('-')
    var a = i.reverse()
    var s = a.join("-")
    return (
        <div className="modal" id="exampleModal" aria-labelledby="exampleModalLabel" style={{ display: 'block' }} aria-hidden="true">

            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Información Reporte</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => { modal(false) }}></button>
                    </div>
                    <div className="modal-body mt-2">
                        {/* <b>Folio: </b>{info.Folio}<b>Fecha: </b>{s} */}
                        <div className="row g-3">
                            <div className="col-3">
                                <b>
                                    Folio:
                                </b>
                            </div>
                            <div className="col-3">
                                {info.Folio}
                            </div>
                            <div className="col-3"><b>Fecha:</b></div>
                            <div className="col-3">{s}</div>
                            <div className="col-12">
                                <b>Descripción: </b>{info.Descripcion}
                            </div>
                            <div className="col-12">
                                <b>Observaciones: </b>{info.Observaciones}
                            </div>
                            <div className="col-12">
                                <b>
                                    Persona que Reporta:
                                </b> {info.PersonaS}
                            </div>

                            <div className="col-12"><b>Telefono:</b> {info.Contacto} </div>
                            <div className="col-12"><b>Distrito:</b> {info.mod.age.dis.Distrito} </div>
                            <div className="col-12"><b>Agencia:</b> {info.mod.age.Agencia} </div>
                            <div className="col-12"><b>Modulo:</b> {info.mod.Modulo} </div>
                            <div className="col-12"><b>Persona que Firma:</b> {info.PersonaF} </div>
                            <div className="col-12"><b>Acciones Realizadas:</b> {info.Acciones} </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default ModalInfoH