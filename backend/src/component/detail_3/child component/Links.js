import React, {useState, useEffect, startTransition, useRef, useId, useMemo} from 'react'

import trash from "../../../image/trash.png"
import reload from "../../../image/reload.png"
import plus from "../../../image/plus.png"
import icon1 from "../../../image/icon1.jpg"
import edit from "../../../image/edit.png"

import axios from 'axios'
import { useParams } from 'react-router-dom'
import { getToken } from '../../token'
import { Loading, clearActive, clearAll } from './helper'


const fixedURL = "http://localhost:5000/data/link"

const link_init = {
    links: [],
    searchLink: "",
    totalResult: 0,
}
const status_init = {
    isLoading: true,
    isShow: false,
    isRender: false,
    cId: ""
}
const edit_init = {url: "", title: "", tags: [], id: "", type: "ADD"}
function Links({getTags, tags}) {

    const {docId} = useParams()

    const [data, setData] = useState(link_init);
    const [status, setStatus] = useState(status_init);
    const [editData, setEditData] = useState(edit_init);
    const [total, setTotal] = useState(0);

    const container = useRef(null);
    const editRef = useRef(null);
    const headers = {Authorization: `Beaer ${getToken()}`}


    const linkOrigin = useMemo(() => {
        let links;
        if (getTags.length > 0) {
            let totalResult = 0;
            links = data.links.map(obj => {
                let count = 0
                const linkTags = obj.link.tags

                for (let i = 0; i < linkTags.length; i++)
                    if (getTags.includes(linkTags[i]))
                        count++;
                
                let isMatch = count === getTags.length;
                if (isMatch)
                    totalResult++;
                return {...obj, isMatch} 
            })
            setTotal(totalResult)
        } else {
            links = data.links
        }
        return links
    }, [getTags, data])


    useEffect(() => {
        const control = new AbortController()
        axios.get(`${fixedURL}/doc/${docId}/get`, {headers, signal: control.signal})
             .then(res => {
                const resData = res.data
                const links = resData.links.map(obj => ({link: obj.link, isMatch: true, isSelect: false}))

                setData({...link_init, links})
                setTotal(resData.links.length)
                setStatus({...status, isLoading: false})
             })
             .catch (err => {console.log(err)})

        return () => {
            control.abort()
        };
    }, [status.isRender])




    function addLink() {
        clearAll(undefined, editRef)
        setStatus(prev => {
            if (prev.isShow) {
                container.current.className = container.current.className.replace(" active-1", "")
            } else {
                container.current.className += " active-1"
            }
            return {...prev, isShow: !prev.isShow}
        })

        setEditData(edit_init)
    }

    function clearForm_btn () {
        container.current.className = container.current.className.replace(" active-1", "")
    }

    function reloadAll() {
        setStatus(prev => ({isRender: !prev.isRender, isShow: false}))
        clearAll(undefined, editRef)
        clearForm_btn()
    }

    function changeInput(e) {
        const value = e.target.value
        startTransition(() => {
            let count = 0;
            const links = data.links.map(obj => {
                if (obj.link.title.indexOf(value) > -1)
                    count++
                return {...obj, isMatch: obj.link.title.indexOf(value) > -1}
            })
            setData({...data, links, searchLink: value})
            setTotal(count)
        })
    }

    function editLink(idx, ctn) {
        setStatus(prev => {
            const cId = data.links[idx].link._id
            if (prev.cId === cId) {
                return {...prev, isShow: !prev.isShow, cId: ""}
            } else {
                return {...prev, isShow: true, cId}
            }
        })
        const link = data.links[idx].link
        setEditData({url: link.url, title: link.title, tags: link.tags, id: link._id, type: "EDIT"})

        clearAll(idx, editRef)
        clearForm_btn()
        clearActive("edit", ["active-1", "active-2"], "active-1", ctn)
    }   

    function deleteLink(idx, ctn) {
        axios.post(`${fixedURL}/doc/${docId}/delete`, {id: data.links[idx].link._id}, {headers})
             .then(() => reloadAll())

        setStatus({...status, isShow: false})

        clearAll(idx, editRef)
        clearForm_btn()
        clearActive("delete", ["active-1", "active-2"], "active-2", ctn)
    }







    if (status.isLoading)
        return <Loading/>
    
    return <div className="display-chapters">
    <div className="search-tag">
        <div className="flex-50">
            <span className="flex-start label">Chapters</span>
            <span className="flex-end mb-2">{total} Results Found.</span>
            <DisplayLinks links={linkOrigin} editLink={editLink} deleteLink={deleteLink} container={editRef}/>
        </div>

        <div className="flex-40">
            <form action="" onSubmit={e => e.preventDefault()}>
                <label className="label" htmlFor="search-tags">Search Links</label>
                <div className="inline-input-btn mt-1 mb-1">
                    <input className="input" type="text" name="searchLink" value={data.searchLink} onChange={changeInput}/>
                    <button className="btn">Search</button>
                </div>
            </form>

            <div className="inline-btns flex-start">
                <div className="icon-wrap-2">
                    <img className="icon-btn-1" src={reload} alt="" onClick={reloadAll}/>
                </div>
                <div className="icon-wrap-2" ref={container} >
                    <img className="icon-btn-1" src={plus} onClick={addLink} alt="" />
                </div>
            </div>

            {status.isShow && <Form tagsOrigin={tags} reloadAll={reloadAll} editData={editData}/>}
        </div>
    </div>
    </div>
}


function Form({tagsOrigin, reloadAll, editData}) {
    let tagsInit = tagsOrigin.map(obj => ({...obj, tag: {...obj.tag}}));
    const headers = {Authorization: `Beaer ${getToken()}`}

    const {docId} = useParams()
    const [data, setData] = useState(editData)
    const [tags, setTags] = useState(tagsInit)
    const [select, setSelect] = useState([])

    useEffect(() => {
        if (editData.tags.length > 0) {
            const tmp = tags.map( obj => ({...obj, isSelect: data.tags.includes(obj.tag._id)}) )
            setTags(tmp)
        }
        setData(editData)
    }, [editData])


    function handleSubmit(e) {
        e.preventDefault()

        const result = {}
        result.id = data.id
        result.tags = select
        result.title = data.title
        result.url = data.url;

        if (data.type === "ADD") {
            axios.post(`${fixedURL}/doc/${docId}/create`, result, {headers}).then(() => reloadAll())
        } else if (data.type === 'EDIT') {
            axios.post(`${fixedURL}/doc/${docId}/update`, result, {headers}).then(() => reloadAll())
        }
    }   

    function changeInput(e) {
        const value = e.target.value
        startTransition(() => {
            const data = tags.map(obj => ({...obj, isMatch: obj.tag.name.indexOf(value) > -1}))
            setTags(data)
        })
    }

    function selectTag(e, idx) {
        const copy = [...tags]
        let result = [...select];

        if (e.target.checked) {
            result.push(tags[idx].tag._id)
            copy[idx] = {...copy[idx], isSelect: true}
        } else {
            result = result.filter(id => id !== tags[idx].tag._id)
            copy[idx] = {...copy[idx], isSelect: false}
        }

        setTags(copy)
        setSelect(result)
    }

    function changeEdit(e) {
        setData({...data, [e.target.name]: e.target.value})
    }


    return <div>
        <div className="close-wrap">
            <button className="close-btn cl-btn">&times;</button>
        </div>
        <form className="mb-2" onSubmit={e => e.preventDefault()}>
            <div className="mb-2">
                <label htmlFor="1" className="label mb-1">Title</label>
                <input className="input" type="text" required={true} name="title" value={data.title} onChange={changeEdit}/>
            </div>
            <div className="mb-2">
                <label htmlFor="1" className="label mb-1">URL</label>
                <input className="input" type="text" required={true} name="url" value={data.url} onChange={changeEdit}/>
            </div>

            <label htmlFor="1" className="label mb-1">Search Tags</label>
            <div className="inline-input-btn">
                <input className="input" type="text" onChange={changeInput} />
                <button className="btn">Search</button>
            </div>
        </form>
        
        <TagList tags={tags} selectTag={selectTag}/>

        <SelectedTags tags={tags}/>

        <div className="flex-end mt-1">
            <button className="btn" onClick={handleSubmit}>Apply</button>
        </div>
    </div>
}

function DisplayLinks({links, editLink, deleteLink, container}) {
    const wrap_edit_ref = useRef([...new Array(links.length)])

    const chapters = links.map((obj, idx) => {
        if (obj.isMatch) {
            const link = obj.link
            return <div className="option-2 grey" key={link._id}>
                <a className="tag-name" href={link.url} target="_blank"> 
                    {/* <img src={icon1} alt="" className="tag-icon" /> */}
                    {link.title}
                </a>  

                <div className="inline-btns flex-end" id="edit-wrapper" ref={e => wrap_edit_ref.current[idx] = e}>
                    <div className="icon-wrap-2" id="edit">
                        <img className="icon-btn-2" src={edit} alt="" 
                             onClick={() => editLink(idx, wrap_edit_ref.current[idx])}/>
                    </div>
                    <div className="icon-wrap-1" id="delete">
                        <img className="icon-btn-2" src={trash} alt="" 
                             onClick={() => deleteLink(idx, wrap_edit_ref.current[idx])}/>
                    </div>
                </div>
            </div>
        }
    })

    return <div className='options-2' ref={container}>{chapters}</div>
}

function TagList({tags, selectTag}) {
    const id = useId()

    const result = tags.map((obj, idx) => {
        if (obj.isMatch) {
            const tag = obj.tag
            return <div className="option grey" key={tag._id}>
                <label className="tag-name" htmlFor={`${id}-${tag._id}`}>{tag.name}</label>
                <label className="checkbox-wrap show" htmlFor={`${id}-${tag._id}`}>
                    <input type="checkbox" id={`${id}-${tag._id}`} className="checkbox-input box-blue"
                           checked={obj.isSelect} onChange={(e) => selectTag(e, idx)}/>
                    <span className="checkmark"></span>
                </label>
            </div>
        }
    })

    return <div className="options">{result}</div>
}

function SelectedTags({tags}) {
    const result = tags.map(obj => {
        if (obj.isSelect) {
            return <span href="" className="tag-item" key={obj.tag._id}>{obj.tag.name}
                <span className="delete">x</span>
            </span>
        }
    })

    return <div className="flex-start wrap tags gap-1 mt-1">{result}</div>
}

export default React.memo(Links)