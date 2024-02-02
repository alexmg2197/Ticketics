import "./logs.css";
import Navbar from "../Navbar/Navbar";
import { React, useState, useEffect } from "react";
import { getAPI } from "../../utils/useAxios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Loader from "../Loader/Loader";

const Logs = ({ auth }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [logs, setLogs] = useState([]);
    const [load, setLoad] = useState(true)

    useEffect(() => {
        setLoad(true)
        getAPI('v1/AllListOperaciones')
            .then((response) => {
                setLogs(response.data)
                setLoad(false)
            })
    }, [])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
        { id: 'tipo', label: 'Tipo De Accion', minWidth: 140, align: 'center' },
        { id: 'motivo', label: 'Motivo De Cambio', minWidth: 100, align: 'center' },
        { id: 'reporte', label: 'Reporte Que Se Modifico', minWidth: 100, align: 'center' },
        { id: 'persona', label: 'Persona Que Modifico', minWidth: 100, align: 'center' },
        { id: 'Fecha', label: 'Fecha de la operación', minWidth: 100, align: 'center' },
        { id: 'hora', label: 'Hora de la operación', minWidth: 100, align: 'center' },
    ];


    return (
        <div>
            <div>
                <Navbar auth={auth} />
            </div>
            {
                load && <Loader />
            }
            <div className="container-fluid d-flex flex-colum align-items-start pt-2 mb-0 ff">
                <div className="container-fluid w-100 mt-0">
                    <div className="p-3">
                        <h1 className="text-center">Tabla de Logs</h1>
                    </div>

                    <div className="pt-3 pb-3">
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
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
                                            logs.length !== 0
                                                ? (
                                                    logs
                                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                        .map((row) => {
                                                            return (
                                                                <TableRow hover role="checkbox" key={row.IdOperacion}>
                                                                    <TableCell align="center">{row.Tipo}</TableCell>
                                                                    <TableCell align="center">{row.Motivo}</TableCell>
                                                                    <TableCell align="center">{row.rep.Folio}</TableCell>
                                                                    <TableCell align="center">{`${row.pers.Nombre} ${row.pers.ApellidoP} ${row.pers.ApellidoP}`}</TableCell>
                                                                    <TableCell align="center">{row.Fecha}</TableCell>
                                                                    <TableCell align="center">{row.Horafo.split('.')[0]}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                )
                                                : (
                                                    <TableRow>
                                                        <TableCell align="center" colSpan={8}>Sin reportes</TableCell>
                                                    </TableRow>
                                                )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 100]}
                                component="div"
                                count={logs.length}
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

export default Logs 