import { React, useState, useEffect } from "react";
import './panel.css'
import { getAPI, deleteAPI, postAPI } from "../../utils/useAxios";
import Navbar from "../Navbar/Navbar";
import ModalPanel from "../Modal/ModalPanel";
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
import Swal from 'sweetalert2'
import Imprimir from "../Impresion/Imprimir";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ModalInfo from "../Modal/ModalInfo";
import { jwtDecode } from 'jwt-decode'
//import ImprimirPDF from "../Impresion/imprimirPDF";

const Panel = ({ auth }) => {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modal, setModal] = useState(false);
  const [modalI, setModalI] = useState(false);
  const [reportes, setReportes] = useState([])
  const [load, setLoad] = useState(true)
  const [edit, setEdit] = useState(null)
  const [info, setInfo] = useState(null)
  const [sear, setSear] = useState(false)
  const [pause, setPause] = useState(false)
  const [intervalId, setIntervalId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (sear === false) {
      var ui = jwtDecode(localStorage.getItem('access_Token'))
        getAPI(`v1/PersonaByUser/${ui.user_id}`)
          .then((pu)=>{
            getAPI(`v1/ListAllReportesCByDistrito/${pu.data[0].Distrito}`)
              .then((response) => {
                setReportes(response.data)
                setLoad(false)
              })
          })
    }
  }, [sear])

  useEffect(() => {
    if (!pause) {
      const intervalId = setInterval(() => {
        window.location.reload();
      }, 120000);

      setIntervalId(intervalId)

      return () => clearInterval(intervalId);
    }
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const print = (datos) => {
    setPause(true)
    Swal.fire({
      title: "Re-Impresión",
      text: "¿Qué pasó con el anterior?",
      icon: "question",
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Imprimir"
    }).then((result) => {
      if (result.isConfirmed) {        

        var ui = jwtDecode(localStorage.getItem('access_Token'))
        getAPI(`v1/PersonaByUser/${ui.user_id}`)
          .then((uid)=>{
            const RegOpe = {
              'ReporteId': datos.IdReporte,
              'PersonaId': uid.data[0].IdPersona,
              'Tipo': 'Impresión',
              'Motivo': result.value
            }
            postAPI('v1/RegistrarOpe', RegOpe)
              .then((reg) => {
                if (reg?.tipo === 'mensaje') {
                  setPause(false)
                  Imprimir(datos)
                  // ImprimirPDF(datos)
                } else if (reg?.tipo === 'error') {
                  toast.error(reg?.mensaje, {
                    autoClose: 1500,
                    position: 'top-right'
                  })
                }
              })
          })
      }
    });
  }

  const delReg = (idRe, idPer) => {
    clearInterval(intervalId);
    setPause(true)
    Swal.fire({
      title: "¿Estas Seguro que Deseas Eliminar el Reporte?",
      text: "Esta accion no se puede revertir",
      icon: "error",
      input: "text",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAPI(`v1/EliminarReporte/${idRe}`)
          .then((rPet) => {
            if (rPet.tipo === 'mensaje') {
              toast.success(rPet.data, {
                autoClose: 1500,
                position: 'top-right'
              })
              var ui = jwtDecode(localStorage.getItem('access_Token'))
                getAPI(`v1/PersonaByUser/${ui.user_id}`)
                  .then((uidr)=>{
                    const RegOpe = {
                      'ReporteId': idRe,
                      'PersonaId': uidr.data[0].IdPersona,
                      'Tipo': 'Eliminar',
                      'Motivo': result.value
                    }
                    postAPI('v1/RegistrarOpe', RegOpe)
                      .then((reg) => {
                        if (reg?.tipo === 'mensaje') {
                          setPause(false)
                          toast.success(reg.data, {
                            autoClose: 1500,
                            position: 'top-right'
                          })
                          navigate(0)
                        } else if (reg?.tipo === 'error') {
                          setPause(false)
                          toast.error(reg?.mensaje, {
                            autoClose: 1500,
                            position: 'top-right'
                          })
                        }
                      })
                  })
            } else {
              setPause(false)
              toast.error(rPet.data, {
                autoClose: 1500,
                position: 'top-right'
              })
            }
          })

      }
    });
  }

  const reemplazar = (datos) => {
    clearInterval(intervalId);
    setPause(true)
    setEdit(datos)
    setModal(true)
  }

  const infor = (datos) => {
    setInfo(datos)
    setModalI(true)
  }


  const busqueda = (folio) => {
    clearInterval(intervalId);
    setPause(true)
    let ff = folio.toUpperCase()
    setSear(true)
    clearTimeout()
    setTimeout(() => {
      setLoad(true)
      if (folio !== '' && folio !== null) {
        getAPI(`v1/ReporteByFolio/${ff}`)
          .then((res) => {
            setPause(false)
            setReportes(res.data)
            clearTimeout()
            setLoad(false)
          })
      } else {
        clearTimeout()
        setSear(false)
      }
    }, 1500)
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
    { id: 'areaA', label: 'Area que Atiende', minWidth: 100, align: 'center' },
    { id: 'fecha', label: 'Fecha de Inicio', minWidth: 100, align: 'center' },
    { id: 'personaA', label: 'Persona Asignada', minWidth: 100, align: 'center' },
    { id: 'estatus', label: 'Estatus', minWidth: 100, align: 'center' },
    { id: 'fechaf', label: 'Fecha Final', minWidth: 100, align: 'center' },
    { id: 'prioridad', label: 'Prioridad', minWidth: 100, align: 'center', },
    { id: 'opciones', label: 'Opciones', minWidth: 100, align: 'center', },
  ];

  return (
    <div className="fondo-p">
      <Navbar auth={auth} />
      <ToastContainer />
      {
        load && <Loader />
      }
      {
        modal && <ModalPanel modal={setModal} edit={edit} pause={setPause} />
      }
      {
        modalI && <ModalInfo modal={setModalI} info={info} />
      }
      <div className="container-fluid d-flex flex-colum align-items-start pt-2 mb-0 ff">
        <div className="container-fluid w-100 mt-0">
          <h1 className="mt-0 text-center">
            Dirección de Tecnologías de la Información y Comunicación
          </h1>
          <div className="pt-3 pb-3">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <div className="container-fluid py-2 w-100 position-static d-flex align-items-center justify-content-end search">
                <label htmlFor="search" className="form-label m-0 me-2 p-0">Reporte</label>
                <div className="contI">
                  <input type='text' id='search' className="IS" variant="plain" placeholder="AAAA-A-0000" onKeyUp={(e) => { busqueda(e.target.value) }} />
                  <i className="fa-solid fa-magnifying-glass lupa"></i>
                </div>
              </div>
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
                      reportes.length !== 0
                        ? (
                          reportes
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                              return (
                                <TableRow hover role="checkbox" key={row.IdReporte}>
                                  <TableCell align="center">{row.Folio}</TableCell>
                                  <TableCell align="center">{row.mod.age.Agencia}</TableCell>
                                  <TableCell align="center">{row.per.area.Nombre}</TableCell>
                                  <TableCell align="center">{row.FechaI}</TableCell>
                                  <TableCell align="center">{`${row.per.Nombre} ${row.per.ApellidoM} ${row.per.ApellidoP}`}</TableCell>
                                  <TableCell align="center">{row.Estatus}</TableCell>
                                  <TableCell align="center">{row.FechaF}</TableCell>
                                  {
                                    {
                                      'Normal': <NTableCell align="center">{row.Prioridad}</NTableCell>,
                                      'Urgente': <UTableCell align="center">{row.Prioridad}</UTableCell>,
                                      'Muy Urgente': <MTableCell align="center">{row.Prioridad}</MTableCell>,

                                    }[row.Prioridad]
                                  }
                                  <TableCell align="center">
                                    <div>
                                      <button onClick={() => { reemplazar(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1.14em" height="1em" viewBox="0 0 758 666"><path fill="#333333" d="M558 554V425l80-80v235c0 47-39 86-85 86H85c-47 0-85-39-85-86V113c0-47 38-86 85-86h475v1l-80 79H112c-17 0-32 15-32 33v414c0 18 15 32 32 32h414c17 0 32-14 32-32zm76-488l85 85l39-39l-85-85zM335 366l84 85l271-271l-84-85zm-60 144l116-31l-85-85z" /></svg></button>
                                      <button onClick={() => { delReg(row.IdReporte, row.per.IdPersona) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 42 42"><path fill="#333333" d="M12.5 16.5v17h3v-17h-3zm6 0v17h3v-17h-3zm6 0v17h3v-17h-3zm3-12c0-2.5-.609-3-3-3h-10c-2.52 0-2.98.55-2.98 3.01L11.5 7.5h-8c-1.48 0-2 .49-2 2v1c0 1.55.52 2 2 2h1v26c0 2.49.55 3 3 3h24c2.5 0 4-.471 4-3v-26h1c1.51 0 2-.48 2-2v-1c0-1.48-.43-2-2-2h-9v-3zm-3 0v3h-10v-3h10zm-15 8h21v24h-21v-24z" /></svg></button>
                                      <button onClick={() => { print(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></g></svg></button>
                                      <button onClick={() => { infor(row) }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#333333" d="M12 17q.425 0 .713-.288T13 16v-4q0-.425-.288-.713T12 11q-.425 0-.713.288T11 12v4q0 .425.288.713T12 17Zm0-8q.425 0 .713-.288T13 8q0-.425-.288-.713T12 7q-.425 0-.713.288T11 8q0 .425.288.713T12 9Zm0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z" /></svg></button>
                                    </div></TableCell>
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
  )
}

export default Panel