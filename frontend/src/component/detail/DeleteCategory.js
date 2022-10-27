import axios from 'axios'
import {useState, useEffect, useId} from 'react'
import { getToken } from '../token'

const GROUP_TYPE = "group"
const TAG_TYPE = "tag"

function insertData(url, data, config) {
    axios.post(url, data, config)
         .then(res => {})
         .catch(err => console.log(err))
}

function DeleteCategory(props) {
    const {docId, tags, groups} = props
    const [popups, setPopups] = useState({group: false, tag: false})

    function handleSubmit(input, type) {
        if (type === GROUP_TYPE) {
            const url = `http://localhost:5000/data/delete/doc/${docId}/group/${input}`
            const data = {}
            console.log(docId, input)
            const config = {
                headers: {authorization: `Beaer ${getToken()}`}
            }
            insertData(url, data, config)
        } else if (type === TAG_TYPE) {
            const url = `http://localhost:5000/data/delete/doc/${docId}/tag/${input}`
            const data = {}
            console.log(docId, input)
            const config = {
                headers: {authorization: `Beaer ${getToken()}`}
            }
            insertData(url, data, config)
        }
        setPopups(prev => ({...prev, [type]: false}))
    }
    
    function triggerPopup(type) {
        cleanUp(type)
        setPopups(prev => ({...prev, [type]: !prev[type]}) )
    }

    function cleanUp(type) {
        const result = {}
        for (const [key, value] of Object.entries(popups)) {
            result[key] = key === type ? value : false
        }
        setPopups(result)
    }

    return <div className="data">
    <div>
        <button className="btn" onClick={() => triggerPopup(GROUP_TYPE)}>Delete Group</button>
        <button className="btn ml-1" onClick={() => triggerPopup(TAG_TYPE)}>Delete Tag</button>
    </div>

    {popups.group && <InputField handleSubmit={handleSubmit} 
                                name="Group ID"
                                type={GROUP_TYPE} />}

    {popups.tag && <InputField handleSubmit={handleSubmit} 
                                name="Tag ID"
                                type={TAG_TYPE} />}
    </div>
}

function InputField(props) {
    const {handleSubmit, name, type} = props
    const [input, setInput] = useState("")
    const id = useId()

    return <div className="form-wrapper">
    <form className="global-block" onSubmit={e => e.preventDefault()}>
        <div className="mb-2">
            <label htmlFor={id} className="label mb-1">{name}</label>
            <div className="inline-input-btn">
                <input  type="text" 
                        id={id}
                        name={id}
                        className="input"
                        value={input}
                        onChange={e => setInput(e.target.value)} />
                <button className="btn ml-1" onClick={e => handleSubmit(input, type)}>Apply</button>
            </div>
        </div>
    </form>
    </div>
}

export default DeleteCategory