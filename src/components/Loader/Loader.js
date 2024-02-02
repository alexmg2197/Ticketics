import React from "react";
import { RotatingLines } from  'react-loader-spinner'
import './loader.css'

const Loader = () =>{
    return (
        <div className="loader d-flex justify-content-center align-items-center">
            <RotatingLines
                strokeColor="#062934"
                strokeWidth="5"
                animationDuration="0.75"
                width="196"
                visible={true}
            />
        </div>
    )
}

export default Loader