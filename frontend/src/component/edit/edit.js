import {useState, useEffect} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../token'

import '../../css/detail.scss'

let init = {
    oldData: {},
    newData: {
        title: "",
        description: "",
        tagName: "",
        tags: [],
    },
    isLoading: true
}

function Edit() {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState(init)

    useEffect(() => {
        const defaultData = location.state.data
        const docId = location.state.docId
        const tags = defaultData.tags.map(tag => {
            return {...tag, isSelect: true}
        })

        console.log(location.state, docId)

        setData({
            ...data,
            oldData: defaultData, 
            newData: {...init.newData, ...defaultData, tags},
            isLoading: false,
            docId
        })
    }, [])

    if (data.isLoading) {
        return <h1>loading</h1>
    }



    
    function handleSumit() {
        let tags = data.newData.tags.filter(tag => tag.isSelect)
        tags = tags.map(tag => {
            delete tag.isSelect
            return tag
        })

        const newData = data.newData
        const result = {title: newData.title, description: newData.description, tags, id: data.docId}
        const cancelToken = axios.CancelToken.source()

        console.log(tags)

        axios.post('http://localhost:5000/data/update/info', result, {
            cancelToken: cancelToken.token,
            headers: {"Authorization": `Beaer ${getToken()}`}
        })
        .then(() => {
            navigate(`/doc/${data.docId}`)
        })
        .catch(err => {
            if (axios.isCancel()) {
                console.log("Request Cancelled!")
            }
            console.log(err)
        })

        return () => {
            cancelToken.cancel()
        }
    }





    function changeInput(e) {
        setData({
            ...data, 
            newData: {...data.newData, [e.target.name]: e.target.value}
        })
    }

    function createTag(e) {
        const tagName = data.newData.tagName
        if (tagName.length === 0) {
            alert("Tag name cannot be added with empty value")
            return
        }

        let tags = data.newData.tags.filter(tag => tag.name === tagName)
        if (tags.length > 0) {
            alert("Tag name is aldready existed! Please type different name")
            return
        }

        const newData = data.newData
        const newTag = {"name": newData.tagName, isSelect: true}
        setData({
            ...data,
            newData: {...newData, tags: [...newData.tags, newTag]}
        })
    }

    function addTag(e) {
        const newData = data.newData
        let tags = newData.tags.map(tag => {
            const isCurrent = e.target.name === tag.name
            return {...tag, isSelect: isCurrent ? e.target.checked : tag.isSelect}
        });


        setData({
            ...data,
            newData: {...newData, tags}
        })
    }

    function deleteTag(e) {
        const tags = data.newData.tags.map(tag => {
            const isCurrent = e.target.name === tag.name
            return {...tag, isSelect: isCurrent ? false : tag.isSelect}
        })

        setData({
            ...data,
            newData: {...data.newData, tags}
        })
    }



    return  <div className="center-all">
    <form className="form-wrapper pd-2 max-width-1" onSubmit={e => e.preventDefault()}>
        <div className="mb-2">
            <label htmlFor="title" className="label mb-1">Title</label>
            <input  type="text" 
                    id="title" 
                    name="title"
                    className="input"
                    value={data.newData.title} 
                    onChange={changeInput} />
        </div>
        <div className="mb-2">
            <label htmlFor="description" className="label mb-1">Title</label>
            <textarea   type="text"
                        className="input"
                        name="description" 
                        rows="6" 
                        id="description"
                        value={data.newData.description}
                        onChange={changeInput}></textarea>
        </div>
        <div className="mb-2">
            <label htmlFor="create-tag" className="label mb-1">Create Tag</label>
            <div className="inline-input-btn dropdown-tags">
                <input  type="text" 
                        name="tagName"
                        className="input trigger"
                        value={data.newData.tagName}
                        onChange={changeInput} />
                <button className="btn ml-1" onClick={createTag}>Add</button>
            </div>

            <div className="dropdown mt-1 max-height-1">
                {
                    data.newData.tags.map(tag => {
                        return <div className="global-checkbox-wrapper" key={tag.name}>
                            <input type="checkbox" id={tag.name} name={tag.name} checked={tag.isSelect} onChange={addTag} />
                            <label htmlFor={tag.name}>{tag.name}</label>
                        </div>
                    })
                }
            </div>
        </div>

        <div className="block mb-2">
            {
                data.newData.tags.map(tag => {
                    if (tag.isSelect) {
                        return <a   className="tag-item color1"
                                    name={tag.name} 
                                    key={tag.name}
                                    onClick={deleteTag}>{tag.name}
                        <span className="delete" style={{marginLeft: "4px"}}>x</span>
                        </a>
                    }
                })
            }
        </div>

        <div className="submit">
            <button className="btn" type="button" onClick={handleSumit}>Submit</button>
        </div>

    </form>
    </div>
}

export default Edit