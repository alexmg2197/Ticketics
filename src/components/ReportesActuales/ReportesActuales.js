import { React, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { getAPI } from "../../utils/useAxios";
import './reportesActuales.css'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2'
import ModalFinalizar from "../Modal/ModalFinalizarReporte";
import ModalReportesActuales from "../Modal/ModalReportesActuales";
import ModalInfo from "../Modal/ModalInfo";
import { jwtDecode } from 'jwt-decode'
import Loader from "../Loader/Loader";

const ReportesActuales = ({ auth, user }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modal, setModal] = useState(false);
    const [modalF, setModalF] = useState(false);
    const [modalI, setModalI] = useState(false);
    const [reportes, setReportes] = useState(null)
    const [info, setInfo] = useState(null)
    const [id, setId] = useState(null)
    const [intervalId, setIntervalId] = useState(null);
    const [fin, setFin] = useState(0)
    const [load, setLoad] = useState(true)

    var token = jwtDecode(localStorage.getItem('access_Token'))

    useEffect(() => {
        const intervalId = setInterval(() => {
            window.location.reload();
          }, 120000);
    
          setIntervalId(intervalId)
    
          return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        if (token.user_id !== null && token.user_id !== 'null') {
            setLoad(true);
            if (id === null) {
                getAPI(`v1/PersonaByUser/${token.user_id}`)
                    .then((rr) => {
                        getAPI(`v1/ReporteByPersona/${rr.data[0].IdPersona}`)
                            .then((rp) => {
                                if (rp.data.length === 1) {
                                    setReportes({ 'unique': rp.data })
                                } else {
                                    let c = 0
                                    rp.data.map((co) => {
                                        if (co.Estatus === 'Iniciado') c++

                                        return c
                                    })

                                    setFin(c)
                                    setReportes(rp.data)
                                }
                                setLoad(false)
                            })
                    })
            }
        }
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const infor = (datos) => {
        setInfo(datos)
        clearInterval(intervalId);
        setModalI(true)
    }

    const editRRA = (datos) => {
        setInfo(datos)
        clearInterval(intervalId);
        setModal(true)
    }

    const FinRRA = (datos) => {
        setInfo(datos)
        clearInterval(intervalId);
        setModalF(true)
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
        { id: 'folio', label: 'Folio', minWidth: 140, align: 'center' },
        { id: 'areaN', label: 'Area que Notifica', minWidth: 100, align: 'center' },
        { id: 'areaA', label: 'Area que Atiende', minWidth: 140, align: 'center' },
        { id: 'fechaI', label: 'Fecha de Inicio', minWidth: 100, align: 'center' },
        { id: 'prioridad', label: 'Prioridad', minWidth: 150, align: 'center', },
        { id: 'opciones', label: 'Opciones', minWidth: 60, align: 'center', },
    ];

    return (
        <div className="fondo">
            <Navbar auth={auth} />
            {
                load && <Loader />
            }
            {
                modal && <ModalReportesActuales modal={setModal} info={info} user={user} />
            }
            {
                modalI && <ModalInfo modal={setModalI} info={info} />
            }
            <div className="container-fluid w-100 h-100 d-flex flex-colum align-items-start pt-3">
                {
                    modalF && <ModalFinalizar modal={setModalF} info={info} />
                }
                <div className="container-fluid w-100">
                    <h1 className="mt-0 text-center">
                        Dirección de Tecnologías de la Información y Comunicación
                    </h1>
                    <div className="pt-3 fondo w-100">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead >
                                        <TableRow>
                                            {columns.map((column) => (
                                                <StyledTableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    style={{ minWidth: column.minWidth }}
                                                >
                                                    {column.label}
                                                </StyledTableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            reportes !== null && (
                                                (reportes?.unique) ? (
                                                    reportes?.unique[0].Estatus === 'Iniciado' ? (
                                                        <TableRow hover role="checkbox" key={reportes?.unique[0].IdReporte}>
                                                            <TableCell align="center">{reportes?.unique[0].Folio}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].mod.age.Agencia}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].per.area.Nombre}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].FechaI}</TableCell>
                                                            {
                                                                {
                                                                    'Normal': <NTableCell align="center">{reportes?.unique[0].Prioridad}</NTableCell>,
                                                                    'Urgente': <UTableCell align="center">{reportes?.unique[0].Prioridad}</UTableCell>,
                                                                    'Muy Urgente': <MTableCell align="center">{reportes?.unique[0].Prioridad}</MTableCell>,

                                                                }[reportes?.unique[0].Prioridad]
                                                            }
                                                            <TableCell align="center">
                                                                <div>
                                                                    <button onClick={() => { editRRA(reportes?.unique[0]) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#000000" d="M9 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8Zm-4.991 9A2.001 2.001 0 0 0 2 13c0 1.691.833 2.966 2.135 3.797C5.417 17.614 7.145 18 9 18c.287 0 .571-.01.85-.028l-1.41-1.411a1.5 1.5 0 0 1 0-2.122l2-2A1.5 1.5 0 0 1 12.914 14h1.17a1.5 1.5 0 0 1 1.659-1.98A2 2 0 0 0 14 11H4.009Zm7.845 6.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708.708L10.707 15h5.586l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L16.293 16h-5.586l1.147 1.146a.5.5 0 0 1 0 .708Z" /></svg></button>
                                                                    <button onClick={() => { FinRRA(reportes?.unique[0]) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200"><path fill="#333333" d="m1004.237 99.152l-611.44 611.441l-198.305-198.305L0 706.779l198.305 198.306l195.762 195.763L588.56 906.355L1200 294.916L1004.237 99.152z" /></svg></button>
                                                                    <button></button>
                                                                </div></TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <TableRow hover role="checkbox" key={reportes?.unique[0].IdReporte}>
                                                            <TableCell align="center" colSpan="6">Enhorabuena no tienes reportes, trabajas mucho 😎</TableCell>
                                                        </TableRow>
                                                    )
                                                ) : (
                                                    reportes
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            var rc = ''
                                                            if (row.Estatus === 'Iniciado') {
                                                                rc = <TableRow hover role="checkbox" key={row.IdReporte}>
                                                                    <TableCell align="center">{row.Folio}</TableCell>
                                                                    <TableCell align="center">{row.mod.age.Agencia}</TableCell>
                                                                    <TableCell align="center">{row.per.area.Nombre}</TableCell>
                                                                    <TableCell align="center">{row.FechaI}</TableCell>
                                                                    {
                                                                        {
                                                                            'Normal': <NTableCell align="center">{row.Prioridad}</NTableCell>,
                                                                            'Urgente': <UTableCell align="center">{row.Prioridad}</UTableCell>,
                                                                            'Muy Urgente': <MTableCell align="center">{row.Prioridad}</MTableCell>,

                                                                        }[row.Prioridad]
                                                                    }
                                                                    <TableCell align="center">
                                                                        <div>
                                                                            <button onClick={() => { editRRA(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#000000" d="M9 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8Zm-4.991 9A2.001 2.001 0 0 0 2 13c0 1.691.833 2.966 2.135 3.797C5.417 17.614 7.145 18 9 18c.287 0 .571-.01.85-.028l-1.41-1.411a1.5 1.5 0 0 1 0-2.122l2-2A1.5 1.5 0 0 1 12.914 14h1.17a1.5 1.5 0 0 1 1.659-1.98A2 2 0 0 0 14 11H4.009Zm7.845 6.854a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 0-.708l2-2a.5.5 0 0 1 .708.708L10.707 15h5.586l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L16.293 16h-5.586l1.147 1.146a.5.5 0 0 1 0 .708Z" /></svg></button>
                                                                            <button onClick={() => { FinRRA(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200"><path fill="#333333" d="m1004.237 99.152l-611.44 611.441l-198.305-198.305L0 706.779l198.305 198.306l195.762 195.763L588.56 906.355L1200 294.916L1004.237 99.152z" /></svg></button>
                                                                            <button onClick={() => { infor(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#333333" d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.713T12 11q-.425 0-.713.288T11 12v4q0 .425.288.713T12 17Zm0-8q.425 0 .713-.288T13 8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8q0 .425.288.713T12 9Zm0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" /></svg></button>
                                                                        </div></TableCell>

                                                                </TableRow>

                                                            }
                                                            return rc;
                                                        })
                                                )
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={reportes !== null ? (reportes?.unique ? 1 : fin) : 0}
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
    )
}

export default ReportesActuales