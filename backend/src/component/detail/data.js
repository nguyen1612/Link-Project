import axios from 'axios'
import {useEffect, useState, useReducer, useCallback} from 'react'

import reducer from './data_reducer'
import { getToken } from '../token'
import AddLink from './AddLink'
import UpdateLink from './UpdateLink'
import DeleteLink from './DeleteLink'
import AddTag from './Add_Category'
import DeleteCategory from './DeleteCategory'


const SORT_OLDEST_NEWEST = "sort-oldest-newest" 
const SORT_NEWEST_OLDEST = "sort-newest-oldest" 
const SORT_ALPHABET_A_Z = "sort-alphabet-a-z" 
const SORT_ALPHABET_Z_A = "sort-alphabet-z-a" 

const SEARCH_BY_TAG = "search-by-tag" 
const SEARCH_BY_GROUP = "search-by-group" 
const SEARCH_BY_STATUS = "search-by-status" 


const init = {
    quickSearch: "",
    advancedSearch: "",

    sortMode: {
        [SORT_NEWEST_OLDEST]: false,
        [SORT_OLDEST_NEWEST]: false,
        [SORT_ALPHABET_A_Z]: false,
        [SORT_ALPHABET_Z_A]: false,
    },
    advancedMode: {
        [SEARCH_BY_TAG]: true,
        [SEARCH_BY_GROUP]: false,
        [SEARCH_BY_STATUS]: false,
    },

    links: [],
    tags: [],
    groups: [],
    appliedTags: [],
    appliedGroups: [],

    isLoading: true
}

function Data(props) {
    let {docId, linkTag} = props

    const [state, dispatch] = useReducer(reducer, init)

    const [change, setChange] = useState(false)
    const [addLinkPop, setAddLinkPop] = useState(false)
    const [upadateLinkPop, setUpdateLinkPop] = useState(false)
    const [inputId, setInputId] = useState(false)
    const [id, setId] = useState("")
    const [deleteLinkId, setDeleteLinkId] = useState(false)





    useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        fetchData(docId, dispatch, linkTag, cancelToken.token)

        return () => {
            cancelToken.cancel()
        }
    }, [change])


    function handleSubmit1(e) {
        if (state.sortMode[SORT_NEWEST_OLDEST]) {
            dispatch({type: "QUICK_SEARCH_SORT_NEWEST_OLDEST"})
            return
        } 

        if (state.sortMode[SORT_OLDEST_NEWEST]) {
            dispatch({type: "QUICK_SEARCH_SORT_OLDEST_NEWEST"})
            return
        } 

        if (state.sortMode[SORT_ALPHABET_A_Z]) {
            dispatch({type: "QUICK_SEARCH_SORT_ALPHABET_A_Z"})
            return
        } 

        if (state.sortMode[SORT_ALPHABET_Z_A]) {
            dispatch({type: "QUICK_SEARCH_SORT_ALPHABET_Z_A"})
            return
        }

        dispatch({type: "QUICK_SEARCH"})
    }

    function handleSubmit2(e) {
        if (state.advancedMode[SEARCH_BY_TAG]) {
            dispatch({type: "ADVANCED_SEARCH_TAG"})
        }

        if (state.advancedMode[SEARCH_BY_GROUP]) {
            dispatch({type: "ADVANCED_SEARCH_GROUP"})
        }
    }



    function quick_search_input(e) {
        dispatch({type: "UPDATE_QUICK_SEARCH_INPUT", value: e.target.value})
    }

    function advanced_search_input(e) {
        dispatch({type: "UPDATE_ADVANCED_SEARCH_INPUT", value: e.target.value})
    }

    function handleSort(e) {
        let tmp = {}
        for (const mode in state.sortMode) {
            tmp[mode] = e.target.id === mode ? true : false
        }
        dispatch({type: "SELECT_SORT_MODE", sortMode: tmp, mode: e.target.id})
    }

    function handleAdvancedMode(e) {
        let tmp = {}
        for (const mode in state.advancedMode) {
            tmp[mode] = e.target.id === mode ? true : false
        }
        dispatch({type: "SELECT_ADVANCED_MODE", advancedMode: tmp, mode: e.target.id})
    }

    function checkTag(e) {
        if (e.target.checked) {
            dispatch({type: "CHECKED_TAG", tagName: e.target.name})
        } else {
            dispatch({type: "UNCHECK_TAG", tagName: e.target.name})
        }
    }

    function checkGroup(e) {
        dispatch({type: "CHECKED_GROUP", groupId: e.target.id})
    }

    function addLink() {
        setAddLinkPop(prev => !prev)
    }

    function editLink() {
        setInputId(prev => {
            if (prev) {
                setUpdateLinkPop(false)
            }
            return !prev;
        })
    }

    function deleteLink() {
        setDeleteLinkId(prev => !prev)
    }

    function myFunction(id) {
        // Copy the text inside the text field
        navigator.clipboard.writeText(id);
        
        // Alert the copied text
        alert("Copied the text: " + id);
    }



    if (state.isLoading) {
        return <h1>Loading</h1>
    }



    return <div className="data">
    <AddTag docId={docId}/>
    <DeleteCategory docId={docId} tags={state.tags} groups={state.groups}/>

    <div className="form-wrapper">
        <form className="global-block" onSubmit={e => e.preventDefault()}>
            <div className="mb-1">
                <label htmlFor="global-input-tag" className="label mb-1">Advanced Search</label>
                <div className="inline-input-btn">
                    <input  type="text" 
                            id="global-input-tag"
                            name="global-input-tag"
                            className="input"
                            value={state.advancedSearch}
                            onChange={advanced_search_input} />
                    <button className="btn ml-1" onClick={handleSubmit2}>Apply</button>
                </div>
            </div>

            <div className="mb-2">
                <span className="label mb-1">Search Mode</span>
                <div className="checkbox-wrapper">
                    <div>
                        <input  type="radio" 
                                name="advanced-search" 
                                id={SEARCH_BY_TAG}
                                className="input-checkbox"
                                onChange={handleAdvancedMode}
                                checked={state.advancedMode[SEARCH_BY_TAG]} />
                        <label htmlFor={SEARCH_BY_TAG}>Search by tag (Default)</label>
                    </div>
                    <div>
                        <input  type="radio" 
                                name="advanced-search"
                                id={SEARCH_BY_GROUP}
                                className="input-checkbox"
                                onChange={handleAdvancedMode} />
                        <label htmlFor={SEARCH_BY_GROUP}>Search by group</label>
                    </div>
                    <div>
                        <input  type="radio" 
                                name="advanced-search"
                                id={SEARCH_BY_STATUS}
                                className="input-checkbox"
                                onChange={handleAdvancedMode} />
                        <label htmlFor={SEARCH_BY_STATUS}>Search by Webase</label>
                    </div>
                </div>
            </div>

            {
                (state.advancedMode[SEARCH_BY_TAG] && <DisplayByTag tags={state.tags} 
                                                                    checkTag={checkTag}/>) 
                || 
                (state.advancedMode[SEARCH_BY_GROUP] && <DisplayByGroup groups={state.groups}
                                                                        checkGroup={checkGroup}/>)
            }
        </form>
    </div>


    <div className="form-wrapper-2">
        <form onSubmit={e => e.preventDefault()}>
            <div className="mb-2">
                <label htmlFor="global-input-tag" className="label mb-1">Quick Search</label>
                <div className="inline-input-btn">
                    <input  type="text" 
                            id="global-input-tag"
                            name="quickSearch"
                            className="input"
                            value={state.quickSearch}
                            onChange={quick_search_input} />
                    <button className="btn ml-1" onClick={handleSubmit1}>Apply</button>
                </div>
            </div>
            <div className="mb-2">
                <span className="label mb-1">Sort Mode</span>
                <div className="checkbox-wrapper">
                    <div>
                        <input  type="radio" 
                                name="sort"
                                id={SORT_NEWEST_OLDEST}
                                className="input-checkbox"
                                onChange={handleSort} />
                        <label htmlFor={SORT_NEWEST_OLDEST}>Newest to Oldest</label>
                    </div>
                    <div>
                        <input  type="radio" 
                                name="sort"
                                id={SORT_OLDEST_NEWEST}
                                className="input-checkbox"
                                onChange={handleSort} />
                        <label htmlFor={SORT_OLDEST_NEWEST}>Oldest to Newest</label>
                    </div>
                    <div>
                        <input  type="radio" 
                                name="sort"
                                id={SORT_ALPHABET_A_Z}
                                className="input-checkbox"
                                onChange={handleSort} />
                        <label htmlFor={SORT_ALPHABET_A_Z}>Alphabet [A - Z]</label>
                    </div>
                    <div>
                        <input  type="radio" 
                                name="sort"
                                id={SORT_ALPHABET_Z_A}
                                className="input-checkbox"
                                onChange={handleSort} />
                        <label htmlFor={SORT_ALPHABET_Z_A}>Alphabet [Z - A]</label>
                    </div>
                </div>
            </div>
        </form>

        <div className="dropdown-2">
            {state.links.map(data => {
                if (data.link._id === undefined)
                    return
                if (data.isMatched && data.isSelected) {
                    // console.log(data.link._id)
                    return <div className="link-block" key={data.link._id}>
                    <a href={data.link.url} target="_blank" className="link-name limit-txt">{data.link.title}</a>
                    <a className="web-name limit-txt" onClick={() => myFunction(data.link._id)}>{data.link._id}</a>
                </div>
                }
            })}
        </div>
    </div>

    <hr></hr>
    <div className='form-wrapper'>
        <button className='btn' type="button" onClick={addLink}>Add Link</button>
        <button className='btn ml-1' type="button" onClick={editLink}>Edit Link</button>
        <button className='btn ml-1' type="button" onClick={deleteLink}>Delete Link</button>
    </div>
    
    {addLinkPop && <AddLink groups={state.groups} tags={state.tags} setAddLinkPop={setAddLinkPop} docId={docId} />}
    {inputId && <InputField links={state.links} setUpdateLinkPop={setUpdateLinkPop}
                            id={id} setId={setId}/>}
    {upadateLinkPop && <UpdateLink groups={state.groups} tags={state.tags} links={state.links} 
                                    linkId={id} editLink={editLink}/>}
    {deleteLinkId && <DeleteLink links={state.links}/>}

    </div>
}



function InputField(props) {
    const {links, setUpdateLinkPop, setId} = props
    const [input, setInput] = useState("")

    function handleSubmit() {
        let isMatched = false
        for (let i = 0; i < links.length; i++) {
            if (links[i].link._id === input) {
                setUpdateLinkPop(true)
                setId(input)
                isMatched = true
                break
            }
        }
        if (!isMatched) {
            setUpdateLinkPop(false)
        }
    }

    return <div className="form-wrapper">
    <form className="global-block" onSubmit={e => e.preventDefault()}>
        <div className="mb-2">
            <label htmlFor="input-checkId" className="label mb-1">Link ID</label>
            <div className="inline-input-btn">
                <input  type="text" 
                        id="input-checkId"
                        name="input-checkId"
                        className="input"
                        value={input}
                        onChange={e => setInput(e.target.value)} />
                <button className="btn ml-1" onClick={handleSubmit}>Apply</button>
            </div>
        </div>
    </form>
    </div>
}






function DisplayByTag(props) {
    const {tags, checkTag} = props

    return <div className="dropdown">
        {
            tags.map(tag => {
                if(tag.isMatched) {
                    const name = tag.name
                    return <div className="global-checkbox-wrapper" key={tag._id}>
                        <input type="checkbox" id={tag._id} name={name} onChange={checkTag} />
                        <label htmlFor={tag._id}>{name}</label>
                    </div>
                }
            })
        }
    </div>
}

function DisplayByGroup(props) {
    const {groups, checkGroup} = props
    return <div className="dropdown">
        {
            groups.map(group => {
                if(group.isMatched) {
                    const id = group.group._id
                    return <div className="global-checkbox-wrapper" key={id}>
                        <input type="radio" id={id} name="group_name" onChange={checkGroup} />
                        <label htmlFor={id}>{group.group.title}</label>
                    </div>   
                }
            })
        }
    </div>
}

function fetchData(docId, dispatch, linkTag, token) {
    const url_2 = `http://localhost:5000/data/get/data/${docId}`
    axios.get(url_2, 
                {
                    cancelToken: token,
                    headers: {authorization: `Beaer ${getToken()}`}
                })
        .then(res => {
            const data = res.data
            dispatch({type: "LOAD_DATA", data, linkTag})
        })
        .catch(err => {
        console.log(err)
        })
    
}

export default Data