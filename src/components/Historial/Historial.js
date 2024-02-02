import { React, useEffect, useState } from "react";
import './historial.css';
import Navbar from "../Navbar/Navbar";
import { getAPI } from "../../utils/useAxios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import { jwtDecode } from 'jwt-decode'
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Loader from "../Loader/Loader";
import ModalInfoH from "../Modal/ModalInfoH";
import Swal from 'sweetalert2'

const Historial = ({ auth }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [reportes, setReportes] = useState([])
    const [load, setLoad] = useState(true)
    const [fin, setFin] = useState(0)
    const [info, setInfo] = useState(null)
    const [modalI, setModalI] = useState(false);
    var token = jwtDecode(localStorage.getItem('access_Token'))

    useEffect(() => {
        var rol = localStorage.getItem('Rol')
        if (rol === 'Admin' || rol === 'Recepcion' || rol === 'Monitoreo') {
            setLoad(true)
            var ui = jwtDecode(localStorage.getItem('access_Token'))
            getAPI(`v1/PersonaByUser/${ui.user_id}`)
                .then((dfg)=>{
                    getAPI(`v1/ListAllReportesCFByDistrito/${dfg.data[0].Distrito}`)
                        .then((response) => {
                            if (response.data.length === 1) {
                                setReportes({ 'unique': response.data })
                            } else {
                                let c = 0
                                response.data.map((co) => {
                                    if (co.Estatus === 'Finalizado') c++
        
                                    return c
                                })
        
                                setFin(c)
                                setReportes(response.data)
                            }
                            setLoad(false)
                        })
                })
        } else {
            if (token.user_id !== null && token.user_id !== 'null') {
                setLoad(true);
                getAPI(`v1/PersonaByUser/${token.user_id}`)
                    .then((rr) => {
                        getAPI(`v1/ReporteByPersonaYEstatus/${rr.data[0].IdPersona}/Finalizado`)
                            .then((rp) => {
                                if (rp.data.length === 1) {
                                    setReportes({ 'unique': rp.data })
                                } else {
                                    let c = 0
                                    rp.data.map((co) => {
                                        if (co.Estatus === 'Finalizado') c++

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
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const infor = (datos) => {
        setInfo(datos)
        setModalI(true)
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
        { id: 'fechaI', label: 'Fecha de Inicio', minWidth: 120, align: 'center' },
        { id: 'fechaF', label: 'Fecha Final', minWidth: 120, align: 'center' },
        { id: 'personaA', label: 'Persona Asignada', minWidth: 130, align: 'center' },
        { id: 'prioridad', label: 'Prioridad', minWidth: 140, align: 'center', },
        { id: 'estatus', label: 'Estatus', minWidth: 110, align: 'center', },
        { id: 'info', label: 'Info', minWidth: 60, align: 'center', },
    ];

    return (
        <div className="fondo">
            {
                load && <Loader />
            }
            {
                modalI && <ModalInfoH modal={setModalI} info={info} />
            }
            <Navbar auth={auth} />
            <div className="container-fluid w-100 h-100 d-flex flex-colum align-items-start pt-3">
                <div className="container-fluid w-100">
                    <h1 className="mt-0 text-center">
                        Dirección de Tecnologías de la Información y Comunicación
                    </h1>
                    <div className="pt-3 fondo w-100">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 660 }}>
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
                                                    reportes?.unique[0].Estatus === 'Finalizado' ? (
                                                        <TableRow hover role="checkbox" key={reportes?.unique[0].IdReporte}>
                                                            <TableCell align="center">{reportes?.unique[0].Folio}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].mod.age.Agencia}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].per.area.Nombre}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].FechaI}</TableCell>
                                                            <TableCell align="center">{reportes?.unique[0].FechaF}</TableCell>
                                                            <TableCell align="center">{`${reportes?.unique[0].per.Nombre} ${reportes?.unique[0].per.ApellidoP} ${reportes?.unique[0].per.ApellidoM}`}</TableCell>
                                                            {
                                                                {
                                                                    'Normal': <NTableCell align="center">{reportes?.unique[0].Prioridad}</NTableCell>,
                                                                    'Urgente': <UTableCell align="center">{reportes?.unique[0].Prioridad}</UTableCell>,
                                                                    'Muy Urgente': <MTableCell align="center">{reportes?.unique[0].Prioridad}</MTableCell>,

                                                                }[reportes?.unique[0].Prioridad]
                                                            }
                                                            <TableCell align="center">{reportes?.unique[0].Estatus}</TableCell>
                                                            <TableCell align="center"><div><button onClick={() => { infor(reportes?.unique[0]) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#333333" d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.713T12 11q-.425 0-.713.288T11 12v4q0 .425.288.713T12 17Zm0-8q.425 0 .713-.288T13 8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8q0 .425.288.713T12 9Zm0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" /></svg></button></div>
                                                            </TableCell>

                                                        </TableRow>
                                                    ) : (
                                                        <TableRow hover role="checkbox" key={reportes?.unique[0].IdReporte}>
                                                            <TableCell align="center" colSpan="9">Enhorabuena no tienes reportes, trabajas mucho 😎</TableCell>
                                                        </TableRow>
                                                    )
                                                ) : (
                                                    reportes
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            if (row.Estatus === 'Finalizado') {
                                                                return (
                                                                    <TableRow hover role="checkbox" key={row.IdReporte}>
                                                                        <TableCell align="center">{row.Folio}</TableCell>
                                                                        <TableCell align="center">{row.mod.age.Agencia}</TableCell>
                                                                        <TableCell align="center">{row.per.area.Nombre}</TableCell>
                                                                        <TableCell align="center">{row.FechaI.split('T')[0]}</TableCell>
                                                                        <TableCell align="center">{row.FechaF.split('T')[0]}</TableCell>
                                                                        <TableCell align="center">{`${row.per.Nombre} ${row.per.ApellidoP} ${row.per.ApellidoM}`}</TableCell>
                                                                        {
                                                                            {
                                                                                'Normal': <NTableCell align="center">{row.Prioridad}</NTableCell>,
                                                                                'Urgente': <UTableCell align="center">{row.Prioridad}</UTableCell>,
                                                                                'Muy Urgente': <MTableCell align="center">{row.Prioridad}</MTableCell>,

                                                                            }[row.Prioridad]
                                                                        }
                                                                        <TableCell align="center">{row.Estatus}</TableCell>
                                                                        <TableCell align="center"><div><button onClick={() => { infor(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#333333" d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.713T12 11q-.425 0-.713.288T11 12v4q0 .425.288.713T12 17Zm0-8q.425 0 .713-.288T13 8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8q0 .425.288.713T12 9Zm0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" /></svg></button></div></TableCell>

                                                                    </TableRow>
                                                                );
                                                            }
                                                        })
                                                )

                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={reportes !== null ? (reportes?.unique ? 1 : fin) : reportes.length}
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

export default Historial