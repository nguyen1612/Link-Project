import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../token'

const init = {
    title: "",
    url: "",
    tagName: "",
    groupName: "",

    appliedTags: [],
    appliedGroups: [],

    isLoading: true
}

const postFix = "!@#!"

function AddLink(props) {
    const {setAddLinkPop, docId} = props
    const navigate = useNavigate()
    const [data, setData] = useState({...init, groups: props.groups, tags: props.tags})



    function handleSubmit() {
        if (data.appliedGroups.length === 0) {
            alert("You must select a group for the link")
            return
        }
        
        const result = {
            title: data.title,
            url: data.url,
            tags: data.appliedTags,
            group: data.appliedGroups[0]
        }
        // console.log(result)
        const cancelToken = axios.CancelToken.source()
        console.log(result)
        axios.post(`http://localhost:5000/data/create/doc/${docId}/link`, result, {
            cancelToken: cancelToken.token,
            headers: {authorization: `Beaer ${getToken()}`}
        })
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log("Request Cancelled!")
            }
            console.log(err)
        })

        setData({...data, url: "", tagName: "", groupName: ""})
        setAddLinkPop(prev => prev)
    }




    function searchGroups(e) {
        console.log("SEARHC GROUOP")
        const text = data.groupName.toUpperCase()

        // Filter groups by input
        const groups = data.groups.map(group => {
            const isMatched = group.group.title.toUpperCase().indexOf(text) > -1
            return {...group, isMatched}
        })

        setData({...data, groups})
    }

    function searchTags(e) {
        console.log("SEARCH TAG")
        const text = data.tagName.toUpperCase()

         // Filter the tags result by input
        const tags = data.tags.map(tag => {
            const isMatched = tag.name.toUpperCase().indexOf(text) > -1
            return {...tag, isMatched}
        })

        setData({...data, tags})
    }


    function changeInput(e) {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    function checkGroup(e) {
        const id = e.target.id
        let appliedGroups = [id.substring(0, id.length - postFix.length)]

        setData({...data, appliedGroups})
    }

    function checkTag(e) {
        const id = e.target.id
        const checked = e.target.checked
        let appliedTags

        if (checked) {
            appliedTags = [...data.appliedTags, id.substring(0, id.length - postFix.length)]
        } else {
            appliedTags = data.appliedTags.filter(tag => tag !== id.substring(0, id.length - postFix.length))
        }

        setData({...data, appliedTags})
    }

    

    return <div className="form-wrapper">
    <form className="global-block max-width-1" onSubmit={e => e.preventDefault()}>
        <div className="mb-1">
            <label htmlFor="title" className="label mb-1">Title</label>
            <input type="text" id="title" name="title" className="input" required={true} value={data.title} onChange={changeInput}/>
        </div>
        <div className="mb-1">
            <label htmlFor="url" className="label mb-1">URL</label>
            <input type="text" id="url" name="url" className="input" required={true} value={data.url} onChange={changeInput}/>
        </div>
        <button style={{display: "none"}}></button>
    </form>

    <form className="global-block max-width-1" onSubmit={e => e.preventDefault()}>
        <div className="mb-1">
            <label htmlFor="groupName" className="label mb-1">Group Search</label>
            <div className="inline-input-btn">
                <input  type="text" 
                        id="groupName"
                        name="groupName"
                        className="input"
                        value={data.groupName}
                        onChange={changeInput} />
                <button className="btn ml-1" onClick={searchGroups}>Search</button>
            </div>
        </div>
        <div className="dropdown max-height-1 mb-1">
            {
                data.groups.map(obj => {
                    const group = obj.group
                    if (obj.isMatched) {
                        return <div className="global-checkbox-wrapper" key={group._id + postFix}>
                            <input type="radio" id={group._id + postFix} name="group" onChange={checkGroup} />
                            <label htmlFor={group._id + postFix}>{group.title}</label>
                        </div>
                    }
                })
            }
        </div>
    </form>
        
    <form className="global-block max-width-1" onSubmit={e => e.preventDefault()}>
        <div className="mb-1">
            <label htmlFor="tagName" className="label mb-1">Tags Search</label>
            <div className="inline-input-btn">
                <input  type="text" 
                        id="tagName"
                        name="tagName"
                        className="input"
                        value={data.tagName}
                        onChange={changeInput} />
                <button className="btn ml-1" onClick={searchTags}>Search</button>
            </div>
        </div>

        <div className="dropdown max-height-1 mb-1">
            {
                data.tags.map(tag => {
                    if (tag.isMatched) {
                        return <div className="global-checkbox-wrapper" key={tag._id + postFix}>
                            <input type="checkbox" id={tag._id + postFix} name={tag.name} onChange={checkTag} />
                            <label htmlFor={tag._id + postFix}>{tag.name}</label>
                        </div>
                    }
                })
            }
        </div>

        <button className="btn" type="button" onClick={handleSubmit}>Create Link</button>
    </form>
</div>
}

export default AddLink