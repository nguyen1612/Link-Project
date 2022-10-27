import axios from 'axios'
import {useState} from 'react'
import {getToken} from '../token'

function DeleteLink(props) {
    const {links} = props
    const [input, setInput] = useState("")

    function handleSubmit() {
        for (let i = 0; i < links.length; i++) {
            if (links[i].link._id === input) {
                const group = links[i].link.groupId
                axios.post(`http://localhost:5000/data/delete/link/${input}`, {group}, {
                    headers: {authorization: `Beaer ${getToken()}`}
                })
                break
            }
        }
    }

    return <div className="form-wrapper">
    <form className="global-block" onSubmit={e => e.preventDefault()}>
        <div className="mb-2">
            <label htmlFor="input-deleteId" className="label mb-1">Link ID</label>
            <div className="inline-input-btn">
                <input  type="text" 
                        id="input-deleteId"
                        name="input-deleteId"
                        className="input"
                        value={input}
                        onChange={e => setInput(e.target.value)} />
                <button className="btn ml-1" onClick={handleSubmit}>Apply</button>
            </div>
        </div>
    </form>
    </div>
}

export default DeleteLink