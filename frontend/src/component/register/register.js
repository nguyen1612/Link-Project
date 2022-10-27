import {useState, useRef} from 'react'
import {onTabClick} from './helper'
import Login from './login'
import Signup from './signup'
import '../../css/register.scss'
import axios from 'axios'


function Register() {
    const [flag, setFlag] = useState(true)
    const [type, setType] = useState('Log In')

    function handleType(type) {
        setFlag(type === 'Sign Up' ? false : true)
        setType(type)
    }

    return <div id="Login"> 
    <div className="overlay"></div>
    <main>
        <section id="login">
            <h2 style={{marginBottom: 0}}>{type}</h2>

            <div className="register">
                <ul id="tabs">
                    <li onClick={(e) => handleType(onTabClick(e))}>
                        <button className="clearBtn active">Log In</button>
                    </li>
                    <li onClick={(e) => handleType(onTabClick(e))}>
                        <button className="clearBtn">Sign Up</button>
                    </li>
                </ul>
                <div className="outer">
                    <div className="inner"></div>
                </div>
            </div>

            {flag ? <Login type={type}/> : <Signup type={type}/>}
        </section>
    </main>
    </div>
}

export default Register