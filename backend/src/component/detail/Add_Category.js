import axios from 'axios'
import {useState, useEffect, useId} from 'react'
import { getToken } from '../token'

const GROUP_TYPE = "group"
const TAG_TYPE = "tag"
const DESCRIPTION_TYPE = "description"

function insertData(url, data, config) {
    axios.post(url, data, config)
         .catch(err => console.log(err))
}

function AddTag(props) {
    const {docId} = props
    const [popups, setPopups] = useState({group: false, tag: false})

    function handleSubmit(input, type) {
        if (type === GROUP_TYPE) {
            const url = `http://localhost:5000/data/create/doc/${docId}/group`
            const data = {title: input}
            const config = {
                headers: {authorization: `Beaer ${getToken()}`}
            }
            insertData(url, data, config)
        }
    }

    function handleSubmit2(input) {
        console.log(docId)
        const url = `http://localhost:5000/data/create/doc/${docId}/link/tag`
        const data = {name: input.name, description: input.description}
        const config = {
            headers: {authorization: `Beaer ${getToken()}`}
        }
        insertData(url, data, config)
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
        <button className="btn" onClick={() => triggerPopup(GROUP_TYPE)}>Add Group</button>
        <button className="btn ml-1" onClick={() => triggerPopup(TAG_TYPE)}>Add Tag</button>
    </div>

    {popups.group && <InputField handleSubmit={handleSubmit} 
                                name="Group Name"
                                type={GROUP_TYPE} />}

    {popups.tag && <Form1 handleSubmit={handleSubmit2}/>}
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


function Form1(props) {
    const {handleSubmit} = props
    const [input, setInput] = useState({name: "", description: ""})
    const id1 = useId()
    const id2 = useId()

    function changeInput(e) {
        setInput({...input, [e.target.name]: e.target.value})
    }

    return <div className='form-wrapper'>
    <form className="global-block" onSubmit={e => e.preventDefault()}>
        <div className="mb-2">
                <label htmlFor={id1} className="label mb-1">Tag Name</label>
                <div className="inline-input-btn">
                    <input  type="text" 
                            id={id1}
                            name="name"
                            className="input"
                            value={input.name}
                            onChange={changeInput} />
                </div>
        </div>
        <div className="mb-2">
            <label htmlFor={id2} className="label mb-1">Tag Name</label>
            <div className="inline-input-btn">
                <textarea rows="4"
                        type="text" 
                        id={id2}
                        name="description"
                        className="input"
                        value={input.description}
                        onChange={changeInput}></textarea>
            </div>
        </div>
        <button className="btn" onClick={e => handleSubmit(input)}>Apply</button>
    </form>
    </div>
}


export default AddTag