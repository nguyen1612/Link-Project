'use strict'

import {useState} from 'react'
import '../../css/register.scss'
import hide from '../../image/hide.png'
import {addBorder, rmvBorder, rmvInvalid, addInvalid, displayPassword, detectPass} from './helper'
import axios from 'axios'
import {useLocation, useNavigate} from 'react-router-dom'
import { deleteToken } from '../helper'

const user = {
    email: '',
    username: '',
    password1: '',
    password2: '',
}

const init = {
    user: user,
    isValid: false
}

const url = 'http://localhost:5500/signup'

function Signup(props) {
    const {type} = props
    const [input, setInput] = useState(init)
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'
    const navigate = useNavigate()

    function handleSubmit(event) {
        event.preventDefault()
        if (input.user.password1 === input.user.password2) {
            deleteToken()
            axios.post(url, input.user).then(res => {
                if (res.status === 200) {
                    console.log(res.data)
                    const token = {
                        access_token: res.data.access_token,
                        refresh_token: res.data.refresh_token
                    }
                    localStorage.setItem('user', JSON.stringify(token))
                    navigate(from, {replace: true})
                }
            }).catch(err => {
                console.log(err)
                const invalidLabel = err.response.data.split(' ')[0]
                addInvalid(invalidLabel)
                handleInput2(init, invalidLabel, input.user[invalidLabel])
            })
        } else {
            addInvalid("password2")
            handleInput2(init, 'password2', input.user['password2'])
        }
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

    function handlePassword(event) {
        handleInput(event)

        let args = arguments
        detectPass(args[1], args[2], args[3])
    }

    return <>
        <form className='form-control' onSubmit={handleSubmit} method='POST'>
            <Email handleInput={handleInput} value={input.user.email}/>

            <Username handleInput={handleInput} value={input.user.username}/>

            <Password1 handleInput={handlePassword} value={input.user.password1}/>

            <PassStrength barId="strength1" labelId="passLabel1"/>

            <Password2 handleInput={handlePassword} value={input.user.password2}/>
            
            <PassStrength barId="strength2" labelId="passLabel2"/>

            {/* <p className='direct-type' onClick={() => handleType('Log In')}>Already have an account? Log in here</p> */}
            <button type="submit" className="btn">{type}</button>
        </form>
    </>
}

function Email(props) {
    const {handleInput, value} = props

    return <div className='input-block' id="email">
                <input  type="email" name="email" required placeholder=" " maxLength="255"
                        value={value}
                        onFocus={() => addBorder('email')}
                        onBlur={() => rmvBorder('email')}
                        onClick={() => rmvInvalid('email')}
                        onChange={handleInput} />
                <label htmlFor="email" className="move-out">Email</label>
            </div>
}

function Username(props) {
    const {handleInput, value} = props

    return <div className='input-block' id="username">
                <input  type="text" name="username" required placeholder=" " maxLength="50"
                        value={value}
                        onFocus={() => addBorder('username')} 
                        onBlur={() => rmvBorder('username')}
                        onClick={() => rmvInvalid('username')}
                        onChange={handleInput} />
                <label htmlFor="username" className="move-out">Username</label>
            </div>
}

function Password1(props) {
    const {handleInput, value} = props

    return <div className='input-block' id="password1">
                <input  type="password" name="password1" required placeholder=" " maxLength="16"
                        value={value}
                        onFocus={() => addBorder('password1')} 
                        onBlur={() => rmvBorder('password1')}
                        onClick={() => rmvInvalid('password1')}
                        onChange={(e) => handleInput(e, 'password1', 'strength1', 'passLabel1')} />
                <label htmlFor="password1" className="move-out">Password</label>
                <div className='img-item' onClick={() => displayPassword('password1', 'eye1')}>
                    <img id='eye1' src={hide}/>
                </div>
            </div>
}

function Password2(props) {
    const {handleInput, value} = props

    return <div className='input-block' id="password2">
                <input  type="password" name="password2" required placeholder=" " maxLength="16"
                        value={value}
                        onFocus={() => addBorder('password2')} 
                        onBlur={() => rmvBorder('password2')}
                        onClick={() => rmvInvalid('password2')}
                        onChange={(e) => handleInput(e, 'password2', 'strength2', 'passLabel2')} />
                <label htmlFor="password2" className="move-out">Confirm Password</label>
                <div className='img-item' onClick={() => displayPassword('password2', 'eye2')}>
                    <img id='eye2' src={hide}/>
                </div>
            </div>
}

function PassStrength(props) {
    const {barId, labelId} = props

    return <div className="input-block noBorder">
                <div className="bar-wrapper">
                    <div className='passStrength' id={barId}></div>
                    <span className="passLabel" id={labelId}>Week</span>
                </div>
            </div> 
}

export default Signup