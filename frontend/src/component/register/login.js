import {useState} from 'react'
import {addBorder, rmvBorder, rmvInvalid, addInvalid, displayPassword} from './helper'
import { useNavigate, useLocation } from 'react-router-dom'

import hide from '../../image/hide.png'
import axios from 'axios'
import { deleteToken } from '../helper'


const user = {
    username: '',
    password: '',
}

const init = {
    user: user,
    isValid: true
}

const url = 'http://localhost:5500/login'

function Login(props) {
    const {type} = props
    const [input, setInput] = useState(init)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    function handleSubmit(event) {
        event.preventDefault()
        deleteToken()

        axios.post(url, input.user)
            .then(res => {
                if (res.status === 200) {
                    const token = {
                        access_token: res.data.access_token,
                        refresh_token: res.data.refresh_token
                    }
                    localStorage.setItem('user', JSON.stringify(token))
                    navigate(from, {replace: true})
                }})
            .catch(err => {
                console.log(err)
                let invalidLabel = 'password'
                if (err.response.data === 'invalid username') {
                    invalidLabel = 'username'
                }
                addInvalid(invalidLabel)
                handleInput2(init, invalidLabel, input.user[invalidLabel])
            })
    }

    function handleInput(event) {
        handleInput2(input, event.target.name, event.target.value)
    }

    function handleInput2(obj, key, value) {
        setInput(
            {
                ...obj, 
                user: {
                    ...obj.user, 
                    [key]: value
                }
            }
        )
    }
    
    return <>
        <form className='form-control' onSubmit={handleSubmit} method='POST'>
            <div className='input-block' id="username">
                <input  type="text" name='username' placeholder=" " maxLength="50" required
                        value={input.user.username} 
                        onFocus={() => addBorder('username')} 
                        onBlur={() => rmvBorder('username')}
                        onClick={() => rmvInvalid('username')}
                        onChange={handleInput} />
                <label htmlFor="username" className="move-out">Username</label>
            </div>

            <div className='input-block' id="password">
                <input  type="password" name='password' placeholder=" " maxLength="16" required
                        value={input.user.password} 
                        onFocus={() => addBorder('password')}
                        onBlur={() => rmvBorder('password')}
                        onClick={() => rmvInvalid('password')}
                        onChange={handleInput} />
                <label htmlFor="password" className="move-out">Password</label>
                <div className='img-item' onClick={() => displayPassword('password', 'eye')}>
                    <img id='eye' src={hide}/>
                </div>
            </div>

            {/* <p className='direct-type' onClick={() => handleType('Sign Up')}>Dont't have an account? Signup here</p> */}
            <button type="submit" className="btn">{type}</button>
        </form>
    </>
}

export default Login