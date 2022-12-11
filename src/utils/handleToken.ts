
export const getToken = () => {
    return localStorage.getItem('token') || null
}

export const setToken = (token:string) => {
    localStorage.setItem('token', token)
}
