import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './modulos.css'
import { Modulos } from "../../JSON/Modulos";
import Ticket from "../Modal/ModalTickets";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";


const Modulo = ({user}) => {

    const [load, setLoad] = useState(true)    
    const [mod, setMod] = useState(false)

    useEffect(()=>{
        if(user!==null){
            setLoad(false)
        }
    },[user])
    
    return (
        <div className='container w-100 h-100 d-flex flex-colum align-items-start pt-5'>
            {
              mod && <Ticket vis = {setMod}/>
            }
            <div className='row w-100'>
                {
                    load ? <Loader /> :
                    Modulos.map((mod) => {
                        if(mod.rol.includes(user)){
                            return(
                                <motion.div className='col-lg-4 col-4 col-md-6 col-12 mb-5' key={mod.id} whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                        {
                                            mod?.route ? (
                                                <Link to={`${mod?.route}`} className="modulo-link" key={mod?.id} target={`${mod?.nombre === 'Monitor' ? '_blank' : ''}`}>
                                                    <div className='card m-auto modulo'>
                                                        <div className='card-body d-flex flex-column justify-content-around align-items-center'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox={`${mod?.viewbox}`}><path d={`${mod?.d}`}></path></svg>
                                                            <h3 className='text-center'>{mod?.nombre}</h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className='card m-auto modulo' onClick={()=>{setMod(true);}}>
                                                    <div className='card-body d-flex flex-column justify-content-around align-items-center'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox={`${mod?.viewbox}`}><path d={`${mod?.d}`}></path></svg>
                                                        <h3 className='text-center'>{mod?.nombre}</h3>
                                                    </div>
                                                </div>
                                            )
                                        }
                                </motion.div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export default Modulo