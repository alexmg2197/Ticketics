import axios from "axios";

const BaseUrlBack = process.env.REACT_APP_API_URL

export const getAPI = (url) => {
    return axios({
        url: BaseUrlBack + url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': 'es-es',
        }
    })
    .then((response) => {
        return response
    })
    .catch((error) => {
        if (error?.request?.status === 500) {
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Problema de conexión al servidor'
            }

            return mensaje
        }else{
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Problema en tiempo de respuesta'
            }

            return mensaje
        }
    })
}

export const postAPI = (url, data) => {
    return axios({
        url: BaseUrlBack + url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': 'es-es'
        },
        data
    })
    .then((response) => {
        if (response.data?.access) {
            const token = {
                'tipo': 'token',
                'data': response.data
            }
            return token
        } else if (response.data?.message) {
            const mensaje = {
                'tipo': 'mensaje',
                'data': response.data.message,
                'id': response.data?.id
            }
            return mensaje
        } else {
            return response.data
        }
    })
    .catch((error) => {
        if (error?.request?.status === 401) {
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Usuario No Registrado'
            }
            return mensaje
        }

        if (error?.request?.status === 500) {
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Error en el Servidor'
            }
            return mensaje
        }

        const mensaje = {
            'tipo': 'error',
            'mensaje': 'Error de conexión'
        }

        return mensaje
    })
}

export const patchAPI = (url, data) => {
    return axios({
        url: BaseUrlBack + url,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': 'es-es'
        },
        data
    })
    .then((response) => {
        if (response.data?.message) {
            const mensaje = {
                'tipo': 'mensaje',
                'data': response.data.message
            }
            return mensaje
        } else {
            return response.data
        }
    })
    .catch((error) => {
        if (error?.request?.status === 401) {
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Operación no realizada'
            }
            return mensaje
        }
        if (error?.request?.status === 405) {
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Datos Incompletos'
            }
            return mensaje
        }
    })
}

export const deleteAPI = (url) => {
    let data = {
        'Estatus': 'Eliminado',
        'Activo': 0
    }
    return axios({
        url: BaseUrlBack + url,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': 'es-es'
        },
        data
    })
    .then((rDelete) => {
        if (rDelete.data?.message) {
            const mensaje = {
                'tipo': 'mensaje',
                'data': rDelete.data.message
            }
            return mensaje
        } else {
            return rDelete.data
        }
    })
    .catch((error) => {
        if (error?.request?.status === 401) {
            const mensaje = {
                'tipo': 'error',
                'mensaje': 'Operación no realizada'
            }
            return mensaje
        }
    })
}