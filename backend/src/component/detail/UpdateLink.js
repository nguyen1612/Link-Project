import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import { getToken } from '../token'

let init = {
    title: "",
    url: "",
    tagName: "",
    groupName: "",

    link: {},

    groups: [],
    tags: [],
    appliedTags: [],
    appliedGroups: [],

    isLoading: true
}

const postFix = "!@#!"


function UpdateLink(props) {
    const {linkId, editLink} = props

    const [data, setData] = useState(init)


    useEffect(() => {
        let link = {}
        for (const obj of props.links) {
            if (obj.link._id === linkId) {
                link = obj.link
                break
            }
        }

        let groups = new Array(props.groups.length)
        for (let i = 0; i < groups.length; i++) {
            const isSelected = props.groups[i].group._id === link.groupId
            groups[i] = {...props.groups[i], isSelected}
        }

        let tags = new Array(props.tags.length)
        let appliedTags = []
        let i = 0;
        for (const tag of props.tags) {
            let isMatched = false;
            for (const linkTag of link.tags) {
                if (tag.name === linkTag.name) {
                    tags[i] = {...tag, isSelected: true}
                    appliedTags.push((({_id}) => _id)(tag))
                    isMatched = true
                    break
                } else {
                }
            }
            if (!isMatched) {
                tags[i] = {...tag, isSelected: false}
            }
            i++
        }

        const result = {...data, 
            title: link.title, url: link.url, link,
            groups,
            tags,
            appliedGroups: [link.groupId],
            appliedTags
        }

        setData(result)
    }, [])


    function handleSubmit() {
        const result = {
            id: linkId,
            title: data.title,
            url: data.url,
            tags: data.appliedTags,
            group: data.appliedGroups[0]
        }

        console.log(result)

        const cancelToken = axios.CancelToken.source()
        axios.post('http://localhost:5000/data/update/link', result, {
            cancelToken: cancelToken.token,
            headers: {authorization: `Beaer ${getToken()}`}
        })
        .catch(err => {
            if (axios.isCancel(err)) {
                console.log("Request Cancelled!")
            }
            console.log(err)
        })
        // editLink()
        setData({...data, url: "", tagName: "", groupName: ""})
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

        let i = 0;
        let groups = [...data.groups]
        for (const obj of data.groups) {
            groups[i] = {...obj, isSelected: (obj.group._id + postFix) === id}
            i++
        }

        setData({...data, appliedGroups, groups})
    }

    function checkTag(e) {
        const name = e.target.name
        const checked = e.target.checked
        const id = e.target.id
        const tmp = id.substring(0, id.length - postFix.length)
        let appliedTags

        if (checked) {
            appliedTags = [...data.appliedTags, tmp]
        } else {
            appliedTags = data.appliedTags.filter(tag => tag !== tmp)
        }

        let i = 0
        const tags = [...data.tags]
        for (const tag of tags) {
            if (tag.name === name) {
                tags[i] = {...tag, isSelected: checked}
                break
            }
            i++;
        }

        setData({...data, appliedTags, tags})
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
                            <input type="radio" id={group._id + postFix} name="group" onChange={checkGroup} checked={obj.isSelected} />
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
                        return <div className="global-checkbox-wrapper" key={tag._id}>
                            <input type="checkbox" id={tag._id + postFix} name={tag.name} 
                                    onChange={checkTag}
                                    checked={tag.isSelected} />
                            <label htmlFor={tag._id + postFix}>{tag.name}</label>
                        </div>
                    }
                })
            }
        </div>

        <button className="btn" type="button" onClick={handleSubmit}>Edit Link</button>
    </form>
</div>
}

export default UpdateLink