import './App.css';
import { HashRouter as Router, Routes, Route, Navigate, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { postAPI } from './utils/useAxios';
import Inicio from './components/Inicio/Inicio';
import Principal from './components/Principal/Principal';
import GenerarReporte from './components/GenerarReporte/GenerarReporte';
import Panel from './components/Panel/Panel';
import Historial from './components/Historial/Historial';
import ReportesActuales from './components/ReportesActuales/ReportesActuales';
import Monitor from './components/Monitor/Monitor';
import Perfil from './components/Perfil/Perfil';
import CrearArea from './components/CrearArea/CrearArea';
import CrearProblema from './components/CrearProblema/CrearProblema';
import EditarPerfil from './components/EditarPerfil/EditarPerfil';
import Registro from './components/Registro/Registro';
import Logs from './components/Logs/Logs';

function App() {

  const [authenticated, setAuthenticated] = useState(localStorage.getItem('access_Token') ? true : false)
  const [user, setUser] = useState(localStorage.getItem('Rol') ? localStorage.getItem('Rol') : null)

  useEffect(() => {
    let minutes = 1000 * 60 * 4
    setInterval(() => {
      if (authenticated) {
        updateToken()
      }
    }, minutes)

    return () => clearInterval()
  }, [authenticated])

  const updateToken = () => {
    if (localStorage.getItem('refresh_Token') !== null) {
      const token = {
        'refresh': localStorage.getItem('refresh_Token')
      }
      postAPI('api/token/refresh/', token)
        .then((res) => {
          if (res.tipo === 'token') {
            localStorage.setItem('access_Token', res.data.access)
            localStorage.setItem('refresh_Token', res.data.refresh)
            setAuthenticated(true)
          } else {
            localStorage.removeItem('access_Token')
            localStorage.removeItem('refresh_Token')
            setAuthenticated(false)
            redirect('/')
          }
        })
        .catch((err) => {
          localStorage.removeItem('access_Token')
          localStorage.removeItem('refresh_Token')
          setAuthenticated(false)
          redirect('/')
        })
    }
  }

  return (
    <div className='root'>
      <Router>
        <Routes>
          <Route element={authenticated ? <Principal auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/Principal' exac />
          <Route element={authenticated ? <GenerarReporte auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/GenerarReporte' exac />
          <Route element={authenticated ? <Panel auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/Panel' exact />
          <Route element={authenticated ? <Historial auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/Historial' exact />
          <Route element={authenticated ? <ReportesActuales auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/ReportesActuales' exact />
          <Route element={<Monitor user={user} />} path='/Monitor' exact />
          <Route element={authenticated ? <Perfil auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/Perfil' exact />
          <Route element={authenticated ? <CrearArea auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/CrearArea' exact />
          <Route element={authenticated ? <CrearProblema auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/CrearProblema' exact />
          <Route element={authenticated ? <EditarPerfil auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/EditarPerfil' exact />
          <Route element={authenticated ? <Registro auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/Registro' exact />
          <Route element={authenticated ? <Logs auth={setAuthenticated} user={user} /> : <Navigate to="/" />} path='/Logs' exact />
          <Route element={authenticated ? <Navigate to="/Principal" /> : <Inicio auth={setAuthenticated} user={setUser} />} path='/' exac />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
