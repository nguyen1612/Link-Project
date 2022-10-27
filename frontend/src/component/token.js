export function getToken() {
    const token = localStorage.getItem('user');

    if (!token)
        return undefined

    const {access_token} = JSON.parse(token)
    return access_token
}