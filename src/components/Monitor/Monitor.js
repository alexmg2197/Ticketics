import { React, useState, useEffect } from "react";
import './monitor.css'
import { getAPI } from "../../utils/useAxios";
import Sidebar from "../Sidebar/Sidebar";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import moment from "moment/moment";
import TableRow from '@mui/material/TableRow';
import Loader from "../Loader/Loader";
import { styled } from '@mui/material/styles';


const Monitor = ({ reload }) => {

    const [filtro, setFiltro] = useState(0);
    const [page, setPage] = useState(0);
    const [reportes, setReportes] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [load, setLoad] = useState(true)

    useEffect(() => {
        const intervalId = setInterval(() => {
            window.location.reload();
        }, 120000);

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        setLoad(true)
        let asd = ''
        if (filtro === 0) asd = 'v1/ListAllReportesC'
        if (filtro === 1) asd = 'v1/ReporteByArea/7b376672-63f3-4d7a-bd76-89ba63fab321'
        if (filtro === 2) asd = 'v1/ReporteByArea/e5949742-fab8-40af-9f27-36c964172744'
        if (filtro === 3) asd = 'v1/ReporteByArea/3a26389f-b884-482c-8f4a-0da1fe6cf00d'
        if (filtro === 4) asd = 'v1/ReporteByEstatus/Finalizado'

        getAPI(asd)
            .then((response) => {
                setReportes(response.data)
                setLoad(false)
            })

    }, [filtro, reload])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const calcTime = (fecha1 = '', hora1 = '', fecha2 = '', hora2 = '') => {
        if ((fecha1, hora1, fecha2, hora2) !== '' && (fecha1, hora1, fecha2, hora2) !== null) {
            let fechaP = moment(`${fecha1} ${hora1.split('.')[0]}`, "YYYY-MM-DD HH:mm:ss")
            let fechaFi = moment(`${fecha2} ${hora2.split('.')[0]}`, "YYYY-MM-DD HH:mm:ss")
            let diff = fechaFi.diff(fechaP, 'd')
            let horas = diff * 24
            let diff2 = fechaFi.diff(fechaP, 'h') - horas
            let min = diff2 * 60
            let diff3 = fechaFi.diff(fechaP, 'm') - min
            return `${diff} ${diff !== 1 ? 'días' : 'día'}, ${diff2} ${diff2 !== 1 ? 'horas' : 'hora'} y ${diff3.toString().substring(0, 2)} ${diff3 !== 1 ? 'minutos' : 'minuto'}`
        }
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: "#5F848D",
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const UTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: "#F4CF4B",
            color: theme.palette.common.white,
        }
    }));

    const MTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: "#F03838",
            color: theme.palette.common.white,
        }
    }));

    const NTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.body}`]: {
            backgroundColor: "#73E77F",
            color: theme.palette.common.white,
        }
    }));

    const columns = [
        { id: 'folio', label: 'Folio', minWidth: 100, align: 'center' },
        { id: 'areaN', label: 'Area que Notifica', minWidth: 100, align: 'center' },
        { id: 'areaA', label: 'Area que Atiende', minWidth: 100, align: 'center' },
        { id: 'fecha', label: 'Fecha de Inicio', minWidth: 100, align: 'center' },
        { id: 'personaA', label: 'Persona Asignada', minWidth: 100, align: 'center' },
        { id: 'prioridad', label: 'Prioridad', minWidth: 100, align: 'center', },
    ];
    const columns2 = [
        { id: 'folio', label: 'Folio', minWidth: 100, align: 'center' },
        { id: 'areaN', label: 'Area que Notifica', minWidth: 100, align: 'center' },
        { id: 'areaA', label: 'Area que Atiende', minWidth: 100, align: 'center' },
        { id: 'fecha', label: 'Fecha de Inicio', minWidth: 100, align: 'center' },
        { id: 'fechaf', label: 'Fecha Final', minWidth: 100, align: 'center' },
        { id: 'tiempo', label: 'Tiempo transcurrido', minWidth: 100, align: 'center' },
        { id: 'personaA', label: 'Persona Asignada', minWidth: 100, align: 'center' },
        { id: 'prioridad', label: 'Prioridad', minWidth: 100, align: 'center', },
    ];

    return (
        <div className="fondo-monitor">
            <div className="row p-0 m-0">
                <div className="col-lg-1 col-1 p-0 m-0">
                    <Sidebar setFiltro={setFiltro} filtro={filtro} />
                </div>
                <div className="col-lg-11 col-11">
                    {
                        load && <Loader />
                    }
                    <div className="container-fluid d-flex flex-colum align-items-start pt-3 pb-3">
                        <div className="container-fluid">
                            {
                                {
                                    0: <h1 className="mt-3 text-center">Dirección de Tecnologías de la Información y Comunicación</h1>,
                                    2: <h1 className="mt-3 text-center">Redes y Telecomunicaciones</h1>,
                                    1: <h1 className="mt-3 text-center">Desarrollo de Sistemas</h1>,
                                    3: <h1 className="mt-3 text-center">Soporte Técnico</h1>,
                                    4: <h1 className="mt-3 text-center">Tareas Completadas</h1>
                                }[filtro]
                            }
                            <div className="container-fluid mt-5 pt-3">
                                <Paper>
                                    <TableContainer style={{overflowY: "auto"}}>
                                        <Table stickyHeader aria-label="sticky table" style={{height: "100%"}}>
                                            <TableHead >
                                                <TableRow>
                                                    {
                                                        filtro !== 4
                                                            ? (
                                                                columns.map((column) => (
                                                                    <StyledTableCell
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        style={{ minWidth: column.minWidth }}
                                                                    >
                                                                        {column.label}
                                                                    </StyledTableCell>
                                                                ))
                                                            )
                                                            : (
                                                                columns2.map((column) => (
                                                                    <StyledTableCell
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        style={{ minWidth: column.minWidth }}
                                                                    >
                                                                        {column.label}
                                                                    </StyledTableCell>
                                                                ))
                                                            )
                                                    }
                                                </TableRow>
                                            </TableHead>                                            
                                            {
                                                reportes.length > 0 
                                                    ? (
                                                        <TableBody>
                                                            {
                                                                reportes
                                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                .map((row) => {
                                                                    return (
                                                                        <TableRow hover role="checkbox" key={row.IdReporte}>
                                                                            <TableCell align="center">{row.Folio}</TableCell>
                                                                            <TableCell align="center">{row.mod.age.Agencia}</TableCell>
                                                                            <TableCell align="center">{row.per.area.Nombre}</TableCell>
                                                                            <TableCell align="center">{row.FechaI}</TableCell>
                                                                            {
                                                                                filtro === 4 && <TableCell align="center">{row.FechaF}</TableCell>
                                                                            }
                                                                            {
                                                                                filtro === 4 && <TableCell align="center">{calcTime(row.FechaI, row.HoraI, row.FechaF, row.HoraF)}</TableCell>
                                                                            }
                                                                            <TableCell align="center">{`${row.per.Nombre} ${row.per.ApellidoM} ${row.per.ApellidoP}`}</TableCell>
                                                                            {
                                                                                {
                                                                                    'Normal': <NTableCell align="center">{row.Prioridad}</NTableCell>,
                                                                                    'Urgente': <UTableCell align="center">{row.Prioridad}</UTableCell>,
                                                                                    'Muy Urgente': <MTableCell align="center">{row.Prioridad}</MTableCell>,

                                                                                }[row.Prioridad]
                                                                            }
                                                                        </TableRow>
                                                                    );
                                                                })
                                                            }
                                                        </TableBody>
                                                    ):(
                                                        <TableBody>
                                                            <TableRow hover role="checkbox">
                                                                <TableCell align="center" colSpan='6'>Sin reportes asignados</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    )
                                            }
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={reportes.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Monitor