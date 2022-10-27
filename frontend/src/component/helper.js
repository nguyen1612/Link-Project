import axios from 'axios'

export function deleteToken() {
    const logoutURL = 'http://localhost:5500/logout'

    const userToken = JSON.parse(localStorage.getItem('user'))
    if(userToken) {
        axios.delete(logoutURL, {token: userToken.refresh_token})
        localStorage.removeItem('user')
    }
}