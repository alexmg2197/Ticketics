import ConectorPluginV3 from './conectorImpresora'
const Imprimir = (datos) => {

    const nombreImpresora = 'Termica'
    const URLPlugin = "http://localhost:8000"

    var s = ''
    var h = ''

    if (datos !== null && datos !== '' && datos !== undefined) {
        var d = datos.FechaI
        var i = d.split('-')
        var a = i.reverse()
        s = a.join("-")
        h = datos.HoraI.split('.')[0]
    }

    const conector = new ConectorPluginV3(URLPlugin);
    conector.Corte(3);
    conector.Iniciar();
    conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO);
    conector.Feed(1);
    conector.EstablecerEnfatizado(true)
    conector.EstablecerTamañoFuente(3, 3)
    conector.EscribirTexto("TICKETICS");
    conector.Feed(5);
    conector.DescargarImagenDeInternetEImprimir("https://hackmd.io/_uploads/rkjLUeVET.png", 0, 216)
    conector.Feed(2)
    conector.EstablecerEnfatizado(true)
    conector.EstablecerTamañoFuente(2, 2)
    conector.EscribirTexto("DIRECCION DE TECNOLOGIAS\nDE LA INFORMACION\nY COMUNICACION");
    conector.Feed(1)
    conector.EscribirTexto("REPORTE\n");
    conector.Feed(1)
    conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_IZQUIERDA)
    conector.EstablecerEnfatizado(true)
    conector.EstablecerTamañoFuente(1, 1)
    conector.EscribirTexto(`Folio: ${datos?.Folio || '\t\t\t'} Fecha:${s}\nDistrito: ${datos?.mod?.age?.dis?.Distrito || ''} \n`);
    conector.EscribirTexto(`Agencia: ${datos?.mod?.age?.Agencia || ''}\n`);
    conector.EscribirTexto(`Modulo: ${datos?.mod?.Modulo || ''}\n`);
    conector.EscribirTexto(`Hora: ${h}\n`);
    conector.EscribirTexto(`Prioridad: ${datos?.Prioridad || ''}\n`);
    conector.EscribirTexto(`Reporte: ${datos?.Descripcion || ''}\n`);
    conector.EscribirTexto(`Observaciones: ${datos?.Observaciones || '\n'}\n`);
    conector.EscribirTexto(`Persona que Reporta: ${datos?.PersonaS || ''}\n`);
    conector.EscribirTexto(`Telefono de Contacto: ${datos?.Contacto || ''}\n`);
    conector.EscribirTexto(`Atendido por: ${datos?.per?.Nombre || ''} ${datos?.per?.ApellidoP || ''} ${datos?.per?.ApellidoM || ''}\n`);
    conector.EscribirTexto("Hora de Atencion:______\n");
    conector.Feed(1)
    conector.EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
    conector.EscribirTexto("_________________________________\n");
    conector.Feed(4)
    conector.EscribirTexto("Firma y Nombre de Conformidad\n");
    conector.Feed(3)
    conector.EscribirTexto('Encuesta de satisfaccion\n\n')
    conector.EscribirTexto('Como calificaria la atencion?\n')
    conector.DescargarImagenDeInternetEImprimir("https://hackmd.io/_uploads/HyX8cH8B6.png", 0, 216)
    conector.EscribirTexto("Motivo de su eleccion:\n________________________________________________\n")
    conector.EscribirTexto("Dudas, comentarios o sugerencias sobre la\natencion, comunicarse a la extension 9292\nproporcionando el numero de Folio")
    conector.Feed(3);
    conector.Corte(3);
    conector.imprimirEn('Termica');
}

export default Imprimir