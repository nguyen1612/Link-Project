import React from 'react'
import {Outlet, Navigate, useLocation} from 'react-router-dom'

export const authContext = React.createContext()

function Protected({children}) {
    const auth = JSON.parse(localStorage.getItem('user'))
    const location = useLocation()
    return (
        auth?.access_token
            ? <Outlet/>
            : <Navigate to="/register" state={{from: location}} replace/>
    ) 
}

export default Protected