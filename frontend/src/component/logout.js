import {Navigate} from 'react-router-dom'
import {deleteToken} from './helper'

function Logout() {
    deleteToken()
    return <Navigate to='/register' />
}

export default Logout