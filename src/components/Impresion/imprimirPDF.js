import jsPDF from 'jspdf';

const ImprimirPDF = (datos) => {

    var d = datos.FechaI
    var i = d.split('-')
    var a = i.reverse()
    var s = a.join("-")
    var h = datos.HoraI.split('.')[0]

    if (datos !== null) {
        const pdf = new jsPDF({
            format: [80, 200],
            unit: 'mm',
            orientation: 'portrait',
        });
        pdf.text('TICKETICS', pdf.internal.pageSize.width / 2, 10, { align: 'center' });
        pdf.addImage('./assets/Logo-Fiscalia-2.png', 'PNG', 20, 15, (pdf.internal.pageSize.width) * .50, 40);
        pdf.setFontSize(10);
        pdf.text(
            'DIRECCION DE SISTEMA CENTENARIO Y TIC\'S\nREPORTE',
            pdf.internal.pageSize.width / 2, 60,
            { align: 'center' }
        );
        pdf.setFontSize(8);
        pdf.text(
            `Folio: ${datos.Folio}                Fecha:${s}\nDistrito: ${datos.mod.age.dis.Distrito}\nAgencia: ${datos.mod.age.Agencia}\nModulo: ${datos.mod.Modulo}\nHora: ${h}\nPrioridad: ${datos.Prioridad}\nReporte: ${datos.Descripcion}\nObservaciones: ${datos.Observaciones}\nAtendido por: ${datos.per.Nombre} ${datos.per.ApellidoP} ${datos.per.ApellidoM}\nHora de Atencion:______\nTelefono de Contacto: ${datos.Contacto}\nPersona que Reporta: ${datos.PersonaS}`,
            10,
            80
        );
        pdf.text('\n\n_________________________________', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 75, { align: 'center' });
        pdf.text('Firma y Nombre de Conformidad', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 64, { align: 'center' });
        pdf.text('\n\nEncuesta de satisfacción', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 60, { align: 'center' })
        pdf.text('\n\n¿Cómo calificaría la atención?', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 56, { align: 'center' })
        pdf.addImage('./assets/happy.png', 'PNG', 13, pdf.internal.pageSize.height - 43, 15, 15);
        pdf.addImage('./assets/meh.png', 'PNG', 33, pdf.internal.pageSize.height - 43, 15, 15);
        pdf.addImage('./assets/sad.png', 'PNG', 53, pdf.internal.pageSize.height - 43, 15, 15);
        pdf.text('\nMotivo de su elección:', 13, pdf.internal.pageSize.height - 23)
        pdf.text('\n___________________________________', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 15, { align: 'center' });
        pdf.setFontSize(6);
        pdf.text('\nDudas, comentarios o sugerencias sobre la atención,\n comunicarse a la extensión 9292\n proporcionando el número de Folio', pdf.internal.pageSize.width / 2, pdf.internal.pageSize.height - 8, { align: 'center' });

        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }
};

export default ImprimirPDF;