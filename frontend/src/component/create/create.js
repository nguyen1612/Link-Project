import {useState, useEffect, useRef, useId, useMemo, useCallback} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import axios from 'axios'

import {getToken} from '../token'

import '../../css/createPage.scss'
import '../../css/detail_2.scss'

import plus from "../../image/plus.png"
import trash from "../../image/minus.png"



const init = {
    title: "",
    tagName: "",
    totalExtraInputs: 0,

    tags: [
        // // Don't remove this. This is a schema for the 'tags' property
        // {
        //     // data: {},
        //     // isMatch: true,
        //     // isSelect: false
        // }
    ],
    addedTags: [],
    newlyTags: [],


    searchTag: "",
}

const fixedURL = 'http://localhost:5000/data/doc'

function Create(props) {
    
    const [input, setInput] = useState(init)
    const [extraInput, setExtraInput] = useState([])
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        // axios.get('http://localhost:5000/data/get/tags', {
        //             cancelToken: cancelToken.token,
        //             headers: {Authorization: `Beaer ${getToken()}`}
        //          })
        //      .then(res => {
        //         const result = res.data.tags.map(tag => {
        //             return {data: {...tag}, isMatch: true, isSelect: false}
        //         })
        //         setInput({
        //             ...input, 
        //             tags: result
        //         })
        //      })
        //      .catch(err => {
        //         if (axios.isCancel(err)) {
        //             console.log("Request cancelled!")
        //         } else {
        //             console.log(err)
        //         }
        //      })

        const headers = {Authorization: `Beaer ${getToken()}`}
        axios.get(`${fixedURL}/get/tag`, {headers})
             .then( ({data}) => {
                const tags = data.map(tag => ({data: tag, isMatch: true, isSelect: false}))
                setInput({...input, tags})
              })
              .catch(err => console.log(`Tag Error: ${err}`))

        return () => {
            cancelToken.cancel()
        }
    }, [])


    function handleSubmit1(e) {
        e.preventDefault()

        if (input.title.length === 0) 
            return

        const result = {}
        result.title = input.title
        result.oldTags = input.addedTags
        result.newTags = input.newlyTags
        result.others = Object.assign({}, ...extraInput.map(obj => ({[obj.key]: obj.value})))
        
        const headers = {Authorization: `Beaer ${getToken()}`}

        console.log(result)

        axios.post(`${fixedURL}/create`, result, {headers})
             .then(() => navigate('/'))
    }

    function handleSubmit2() {
        const searchTag = input.searchTag.toUpperCase();
        let txtValue, tags = [], count = 0; 

        for (let i = 0; i < input.tags.length; i++) {
            txtValue = input.tags[i].data.name
            if (txtValue.toUpperCase().indexOf(searchTag) < 0) {
                tags[count] = {
                    data: {id: input.tags[i].data.id, name: txtValue},
                    isMatch: false
                }
            } else {
                tags[count] = {
                    data: {id: input.tags[i].data.id, name: txtValue},
                    isMatch: true
                }
            }
            count++;
        }

        setInput({...input, tags})
    }

    const handleExtras = useCallback((data, idx) => {
        setExtraInput(p => {
            console.log(data)
            const tmp = [...p]
            tmp[idx] = data
            return tmp
        })
    }, [])




    function handleTitle(e) {
        setInput({...input, title: e.target.value})
    }

    function handleCreateTag(e) {
        setInput({...input, tagName: e.target.value})
    }

    function handleSearchTag(e) {
        const searchTag = e.target.value
        setInput({...input, searchTag})
    }

    function addTag(e) {
        if (e.target.checked) {
            setInput({
                ...input, 
                addedTags: [...input.addedTags, {
                    id: e.target.id,
                    name: e.target.name
                }]
            })
        } else {
            const id = e.target.id
            setInput({
                ...input, 
                addedTags: input.addedTags.filter(tag => tag.id !== id)
            })
        }
    }

    function createTag(e) {
        const tagName = input.tagName

        const result1 = input.addedTags.filter(tag => tag.name === tagName)
        const result2 = input.tags.filter(tag => tag.data.name === tagName)
        if (result1.length > 0 || result2.length > 0) {
            alert("Tag name is already exist! Please provide different name")
            return
        }

        if (tagName.length === 0) {
            alert("Tag name cannot be added with empty value")
            return
        }

        setInput({
            ...input, 
            tagName: "",
            newlyTags: [...input.newlyTags, {name: tagName}]
        })
    }

    function addExtraInput() {
        if (input.totalExtraInputs > 3)
            return
        setInput(prev => ({...input, totalExtraInputs: prev.totalExtraInputs + 1}))
    }



    return  <main className="CreatePage" id="Detail_2">
    <div className="form-wrapper pd-1">
        <div>
            <form className="mb-2">
                <label htmlFor="title" className="label mb-1">Title</label>
                <input id="title" className="input" type="text" required
                        value={input.title}
                        onChange={handleTitle}/>
            </form>

            <div className="mb-2 flex-between">
                <label htmlFor="title" className="label mb-1">Extra Inputs</label>
                <div className="inline-btns flex-start">
                    <div className="icon-wrap-2" id="isAdd">
                        <img className="icon-btn-1" src={plus} alt="" onClick={addExtraInput}/>
                    </div>
                </div>
            </div>

            <ExtraInputs total={input.totalExtraInputs} handleExtras={handleExtras}/>

            <form className="mb-2" onSubmit={e => e.preventDefault()}>
                <label htmlFor="create-tag" className="label mb-1">Create Tag</label>
                <div className="inline-input-btn">
                    <input  type="text" 
                            name="create-tag"
                            className="input"
                            value={input.tagName}
                            onChange={handleCreateTag} />
                    <button className="btn ml-1" onClick={createTag}>Add</button>
                </div>
            </form>

            <div className="flex-start wrap tags gap-1 mt-1">
                {input.addedTags.map(
                    (tag) => 
                    <span href="" className="tag-item" key={tag.id}>{tag.name}
                        <span className="delete">x</span>
                    </span>
                )}
                {input.newlyTags.map(
                    (tag) => 
                    <span href="" className="tag-item" key={tag.name}>{tag.name}
                        <span className="delete">x</span>
                    </span>
                )}
            </div>
        </div>

        <div className="submit">
            <button className="btn" onClick={handleSubmit1}>Submit</button>
        </div>
    </div>

    <div className="form-wrapper pd-1">
        <div className="mb-1">
            <label htmlFor="global-input-tag" className="label mb-1">Search Tags</label>
            <div className="inline-input-btn">
                <input  type="text" 
                        id="global-input-tag"
                        name="global-input-tag"
                        className="input"
                        value={input.searchTag}
                        onChange={handleSearchTag} />
                <button className="btn ml-1" onClick={handleSubmit2}>Apply</button>
            </div>
        </div>

        <div className='options'>
            {input.tags.map(obj => {
                if (obj.isMatch) {
                    const tag = obj.data;
                    return <div className="option grey" key={tag._id}>
                        <label className="tag-name" htmlFor={tag._id}>{tag.name}</label>
                        <label className="checkbox-wrap show" htmlFor={tag._id}>
                            <input type="checkbox" id={tag._id} className={`checkbox-input box-blue`}
                                    name={tag.name} onChange={addTag}/>
                            <span className="checkmark"></span>
                        </label>
                    </div>
                }
            })}
            
        </div>
    </div>
    </main>
}


function ExtraInputs({total, handleExtras}) {
    const id = useId()
    const [inputs, setInputs] = useState([])
    
    useEffect(() => {
        if (total > 0)
            setInputs(p => [...p, 0])
    }, [total])

    return inputs.map((_, idx) => <Input key={`${id}-${idx}`} index={idx} handleInput={handleExtras}/>)
}

function Input({index, handleInput}) {
    const [status, setStatus] = useState({isShow: true, hasKey: false});
    const [input, setInput] = useState({key: "", value: ""});

    function submitKey(e) {
        e.preventDefault()

        if (input.key.length <= 0)
            return alert("The key field must contains at least 1 character")
        

        setStatus(p => ({...p, hasKey: true}))
        handleInput({key: input.key, value: input.value}, index)
    }

    function changeInput(e) {
        setInput({...input, [e.target.name]: e.target.value})
        if (e.target.name === 'value')
            handleInput({key: input.key, value: e.target.value}, index)
    }

    if (status.isShow)
        return <div className="mb-2">
            <form className='flex-between' onSubmit={submitKey}>
                <label htmlFor={input.key} className="label mb-1">
                    {status.hasKey ? <label className="label mb-1">{input.key}</label>
                                   : <input style={{width: "100px", height: "23px"}} name="key" onChange={changeInput}/>
                    }
                </label>
                <div className="icon-wrap-1" id="isDelete" onClick={() => setStatus(p => ({...p, isShow: false}))}>
                    <img className="icon-btn-1" src={trash} alt="" />
                </div>
            </form>
            <form onSubmit={e => e.preventDefault()}>
                <input id={input.key} className="input" name="value" type="text" required onChange={changeInput}/>
            </form>
        </div>
}

export default Create