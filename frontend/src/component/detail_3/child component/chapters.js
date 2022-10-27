import {useState, useEffect, useRef, startTransition, useId, useCallback, useMemo} from 'react'
import {useParams} from 'react-router-dom'

import {getToken} from '../../token'
import axios from 'axios'

import { Loading, ReuseForm } from './helper'

import trash from "../../../image/trash.png"
import reload from "../../../image/reload.png"
import plus from "../../../image/plus.png"
import icon1 from "../../../image/icon1.jpg"
import Links from './Links'


const tag_init = {
    // {tag: {}, isSelected: "", isMatched: ""}
    data: [],
    selectedTag: [],
    form: {},

    searchName: "",
    description: "",
    totalResult: 0,
}
const status_init = {
    button: "SEARCH_LINK",
    isLoading: false,
    isShow: false,
    isRender: false,
}
const fixedURL = 'http://localhost:5000/data/tag'


function Chapters() {

    const {docId} = useParams()
    const [tagData, setTagData] = useState(tag_init);
    const [status, setStatus] = useState(status_init)
    const container = useRef()
    const headers = {Authorization: `Beaer ${getToken()}`}
    
    useEffect(() => {
        axios.get(`${fixedURL}/doc/${docId}/get`, {headers})
             .then( ({data}) => {
                const result = [...new Array(data.length)]
                let i = 0;

                for (const key of data)
                    result[i++] = {...key, isMatch: true, isSelect: false, isEdit: false}

                setTagData({...tagData, data: result, totalResult: result.length})
                setStatus({...status, isLoading: false})
            })
    }, [docId, status.isRender])

    const passTags = useMemo(() => tagData.selectedTag, [tagData.selectedTag])

    function reloadAll() {
        // Clear tagData to default state
        setTagData({...tag_init})
        // Clear status to default state. Trigger Re-render that fetch data from API
        setStatus(prev => ({...status_init, isRender: !prev.isRender}))
        // Clear UI button that has active class
        clearActive("", ["active-1", "active-2"], "")
    }

    function changeInput(e) {
        const tags = tagData.data
        const value = e.target.value

        if (e.target.value.length === 0) {
            const data = tags.map(obj => ({...obj, isMatch: true}))
            setTagData({...tagData, searchName: value, data, totalResult: data.length})
            return;
        }

        startTransition(() => {
            let i = 0;
            const data = tags.map(obj => {
                const tag = obj.tag
                if (tag.name.indexOf(value) > -1) {
                    i++;
                    return {...obj, isMatch: true}
                } else 
                    return {...obj, isMatch: false}
            })
            setTagData({...tagData, searchName: value, data, totalResult: i})
        })
    }

    function applyChange() {
        if (status.button === 'DELETE') {
            axios.post(`${fixedURL}/doc/${docId}/delete`, {ids: tagData.selectedTag}, {headers})
                 .then(() => {
                    console.log('Delete tag success')
                    reloadAll()
                })
        }
    }

    function selectTag(e, idx) {
        const selected_id = e.target.id
        let result = [...tagData.selectedTag]
        let tmp = [...tagData.data]

        // Update selected tag array
        if (e.target.checked)
            result.push(selected_id)
        else
            result = result.filter(id => id !== selected_id)

        // set isSelect for specific tag
        tmp[idx] = {...tmp[idx], isSelect: e.target.checked}

        // extract description from the tag
        const description = tmp[idx].tag.description

        setTagData(prev => ({...prev, selectedTag: result, description, data: tmp}))
    }

    function updateTag(id, data, idx) {
        axios.post(`${fixedURL}/doc/${docId}/update`, {id, ...data}, {headers})
             .then(() => {
                const tmp = [...tagData.data]
                tmp[idx] = {...tmp[idx]}
                tmp[idx].tag = {...tmp[idx].tag}
                tmp[idx].tag.name = data.name
                setTagData({...tagData, data: tmp})
             })
             .catch(err => console.log('Error'))
    }

    function addTag() {
        const html = {
            inputFields: [{name: "", attrs: {required:true, maxLength: 20}}],
            textFields: [{description: "", attrs: {rows: 5, required: false, maxLength: 400}}],
            multiparts: false,
            type: "ADD"
        }

        setTagData({...tagData, form: html})
        setStatus(prev => ({...prev, isShow: !prev.isShow}))
        clearActive('isAdd', ['active-1', 'active-2'], 'active-1')
    }

    function deleteTag() {
        clearActive('isDelete', ['active-1', 'active-2'], 'active-2')
        setStatus({...status, isShow: false, button: "DELETE"})
    }

    function clearActive(except, allName, newName) {
        const childs = container.current.childNodes;

        for (let i = 0; i < childs.length; i++) {
            const className = childs[i].className
            if (childs[i].id === except) {
                const tmp = className.replace(` ${newName}`, '')
                if (tmp !== className) {
                    childs[i].className = tmp
                } else {
                    childs[i].className += ` ${newName}`;
                }
            } else {
                for (let j = 0; j < allName.length; j++) {
                    if (className.includes(allName[j]))
                        childs[i].className = className.replace(` ${allName[j]}`, '')
                }
            }
        }
    }

    if (status.isLoading) {
        return <Loading/>
    }

    return <section className="info-wrap">
    <div className="chapters">
        <div className="search-chapters">
            <form action="" onSubmit={e => e.preventDefault()}>
                <label className="label" htmlFor="search-tags">Search Tags</label>
                <div className="inline-input-btn mt-1 mb-1">
                    <input className="input" type="text" value={tagData.searchName} onChange={changeInput}/>
                    <button className="btn">Search</button>
                </div>
            </form>

            <div className="inline-btns flex-start" ref={container}>
                <div className="icon-wrap-2" onClick={reloadAll}>
                    <img className="icon-btn-1" src={reload} alt=""/>
                </div>
                <div className="icon-wrap-2" id="isAdd" onClick={addTag}>
                    <img className="icon-btn-1" src={plus} alt="" />
                </div>
                <div className="icon-wrap-1" id="isDelete" onClick={deleteTag}>
                    <img className="icon-btn-1" src={trash} alt="" />
                </div>
            </div>

            {status.isShow && <Form html={tagData.form} docId={docId} reloadAll={reloadAll}/>}
            
            <div className="flex-end mb-2">{tagData.totalResult} Result Found.</div>

            <TagList tags={tagData.data} selectTag={selectTag} updateTag={updateTag} type={status.button}/>

            <div className="flex-end mt-2">
                <button className="btn" onClick={applyChange}>Apply</button>
            </div>

            <label className="label" htmlFor="tag-desc">Tag Description</label>
            <p id="tag-desc" className="tag-desc mt-2">{tagData.description}</p>
        </div>

        <Links getTags={passTags} tags={tagData.data}/>
    </div>
</section>
}

function Form({html, docId, reloadAll}) {
    const headers = {Authorization: `Beaer ${getToken()}`}
    function handleSubmit(input) {
        if (input.type === 'ADD') {
            const data = {}
            data.name = input.name;
            data.description = input.description
            addTag(data)
        }
    }

    function addTag(data) {
        axios.post(`${fixedURL}/doc/${docId}/create`, data, {headers})
             .then(() => reloadAll())
             .catch(err => console.log(err))
    }

    return <ReuseForm html_init={html} handleSubmit={handleSubmit}/>
}

function TagList({tags, selectTag, updateTag, type}) {
    tags = tags.map((obj, i) => {
        if (obj.isMatch) {
            const tag = obj.tag

            let boxtype
            if (type === 'SEARCH_LINK' || type === 'DELETE') {
                boxtype = type === 'SEARCH_LINK' ? 'blue' : 'red'
            } else {
                throw new Error("type must be 'SEARCH_LINK' or 'DELETE'")
            }

            return <div className="option grey" key={tag._id}>
                {/* <img src={icon1} alt="" className="tag-icon" /> */}
                <Tag tag={tag} updateTag={updateTag} idx={i}/>
                <label className="checkbox-wrap show" htmlFor={tag._id}>
                    <input type="checkbox" id={tag._id} className={`checkbox-input box-${boxtype}`}
                           checked={obj.isSelect} 
                           onChange={e => selectTag(e, i)}/>
                    <span className="checkmark"></span>
                </label>
            </div>
        }
    })
    return <div className="options">{tags}</div>
}

function Tag({tag, updateTag, idx}) {
    const [input, setInput] = useState(tag.name)
    const [edit, setEdit] = useState(false)
    const container = useRef(null)
    const randomId = useId()

    useEffect(() => {
        function toggle(event) {
            if (container.current && !container.current.contains(event.target)) {
                setEdit(false)
                setInput(tag.name)
            }
        }
        window.addEventListener('mousedown', toggle)
        return () => window.removeEventListener('mousedown', toggle)
    }, [container])

    function submitTagName(e) {
        e.preventDefault();
        setEdit(false);
        if (tag.name !== input) {
            updateTag(tag._id, {name: input}, idx)
        }
    }

    if (edit)
        return <form style={{width: "100%"}} onSubmit={submitTagName} id={randomId} ref={container}>
            <input type="text" className="input-name tag-input" name={tag._id}
                                value={input} onChange={e => setInput(e.target.value)} />
        </form>
    
    return <label className="tag-name" htmlFor={tag._id} onDoubleClick={() => setEdit(true)}>{tag.name}</label>
}

export default Chapters