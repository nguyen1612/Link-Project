import React, {useEffect, useId, useRef, useState} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

import {
    ReuseForm, formatInput, getKey, validateFile,
    UpperCase_First, fomratChars, getPagination
} from './helper'
import { getToken } from '../../token';

import trash from "../../../image/trash.png"
import reload from "../../../image/reload.png"
import plus from "../../../image/plus.png"



const html_init = {
    inputFields: [{name: "", attrs: {maxLength: 20, required: true}}],
    textFields: [{description: "", attrs: {rows: 4, maxLength: 70, required: true}}],
    fileFields: [{id: "", image: {}, attrs: {required: false}}],
    multiparts: true,
    type: "ADD"
}
const status_init = {
    render: false,
    display: false,
    active_id: "",
}

const PAGE_SIZE = 7;
const FIXED_URL = 'http://localhost:5000';

function Characters() {

    const container = useRef(null)
    html_init.fileFields[0].attrs.container = container

    const {docId} = useParams();
    const [html, setHTML] = useState(html_init);
    const [status, setStatus] = useState(status_init)
    const [characters, setCharacters] = useState([])
    const [totalChars, setTotalChars] = useState(1);
    const [renderPag, setRenderPag] = useState(true);
    const headers = {Authorization: `Beaer ${getToken()}`};


    useEffect(() => {
        (async ()=> {
            const {chars_txt, imgIds} = await auto_setCharTxt({pageNum: 1, docId})
            const {chars_img} = await auto_setCharImg({chars_txt, imgIds, docId})

            const chars = fomratChars({chars_img, chars_txt})
            setCharacters(chars)
        })();
    }, [status.render])





    async function handlePage(pageNum) {
        // Fetch all data (character -> images and text)
        const {chars_txt, imgIds} = await auto_setCharTxt({pageNum, docId})
        const {chars_img} = await auto_setCharImg({chars_txt, imgIds, docId})

        const chars = fomratChars({chars_img, chars_txt})
        setCharacters(chars)
    }

    async function auto_setCharTxt({pageNum, docId}) {
        // Fetch all Char's text for specific page (Pagination)
        const {result, total, imgIds} = await fetPage({pageNum, docId});
        setCharacters(result)
        setTotalChars(total)
        return {chars_txt: result, total, imgIds}
    }

    async function auto_setCharImg({imgIds, chars_txt, docId}) {
        // Fetch all Char's images for specific page (Pagination)
        const chars_img = await fetchChars({imgIds, docId, headers})
        return {chars_img}
    }



    function reloadAll() {
        // 1 - Clear form
        // 2 - Re-fetch characters (images, text)
        setStatus(prev => ({...prev, render: !prev.render, display: false}));
        setRenderPag(prev => !prev);
    }

    function addCharacter() {
        setHTML(html_init)
        setStatus(prev => ({...status, display: !prev.display}))
    }

    function editCharacter(e) {
        const id = e.target.id;
        const {character} = characters.filter(obj => obj.character._id === id)[0]
        const process_input = {}
        process_input._id = character._id;
        process_input.imageId = character.imageId
        process_input.name = character.name;
        process_input.description = character.description;
        process_input.type = 'EDIT';

        if (id === status.active_id) {
            setStatus(prev => ({...status, display: !prev.display, active_id: ''}))
        } else if (status.active_id === '') {
            setStatus(prev => ({...status, display: !prev.display, active_id: id}))
        } else if (id !== status.active_id) {
            setStatus({...status, active_id: id})
        }

        const tmp = {...html_init, type: 'EDIT'}
        setHTML(formatInput({html_init: tmp, input: process_input}))
    }

    function deleteCharacter(e) {
        // Display ID in the description field for each character
        setStatus(prev => {
            const isSwitch = prev.display
            const chars = characters.map(obj => {
                const char = obj.character

                // if char_tmp is undefined or empty => display original description
                // if the input is poped up => replace the description with ID
                const char_tmp = char.desc_tmp === '' || !char.desc_tmp 
                const result = isSwitch ? {description: char_tmp ? char.description : char.desc_tmp, desc_tmp: ''} 
                                        : {description: char._id, desc_tmp: char.description}
                return {...obj, character: {...char, ...result}}
            })
            setCharacters(chars)
            return {...status, display: !prev.display}
        })
        
        const tmp = {inputFields: [{ID: "", attrs: {maxLength: 24, required: true}}], multiparts: false, type: 'DELETE'}
        setHTML(tmp)
    }



    let chars = characters.map(obj => {
        const char = obj.character
        return <div className="character" key={char._id}>
            <img className="char-img" src={`data:${obj.type};base64,${obj.base64 ? obj.base64 : ""}`} 
                                      id={char._id} alt="" onClick={editCharacter}/>
            <h4 className="txt-nowrap">{char.name}</h4>
            <div className="char-desc">{char.description}</div>
        </div>
    })

    return <section className="info-wrap">
    <div className="show-char">
        <div className="flex-between" style={{width: "100%"}}>
            <h3>Chatacters</h3>
            <div className="inline-input-btn">
                <div className="inline-btns flex-end">
                    <div className="icon-wrap-2">
                        <img className="icon-btn-2" src={reload} alt="" onClick={reloadAll}/>
                    </div>
                    <div className="icon-wrap-2">
                        <img className="icon-btn-2" src={plus} alt="" onClick={addCharacter}/>
                    </div>
                    <div className="icon-wrap-1">
                        <img className="icon-btn-2" src={trash} alt="" onClick={deleteCharacter}/>
                    </div>
                </div>
            </div>
        </div>

        {status.display && <Form html={html} docId={docId} reloadAll={reloadAll}/>}

        <div className="characters">{chars}</div>

        {characters.length > 0 && <Pagination handlePage={handlePage} totalChars={totalChars} renderPag={renderPag}/>}

    </div>
</section>
}




const Form = React.memo((props) => {
    const headers = {Authorization: `Beaer ${getToken()}`};

    const {html, docId, reloadAll} = props

    function handleSubmit(input) {
        let form = new FormData();
        let new_headers = {...headers, 'Content-Type': 'multipart/form-data'}

        if (input.type === 'DELETE') {
            console.log(input)
            new_headers = {...headers}
        } else {
            const image = input.fileFields[0].image

            // Validate before store data
            const support_type = ['jpeg', 'png', 'jpg']
            const alert_maxSize = "File maximum size is 2MB";
            const alert_supportType = `Support file exentions are ${support_type.map(t => ` ${t}`)}`;
            const condition = {
                maxSize: 2000000, support_type,
                alert_maxSize, alert_supportType
            }
            if(!validateFile(image, condition)) {
                input.fileFields[0].container.current.value = "";
                return
            }

            form.append('file', image);
            form.append('name', input.name);
            form.append('description', input.description);
            if (input.type === 'EDIT') {
                form.append('id', input._id)
                form.append('imageId', input.fileFields[0].id)
            }
        }

        switch (input.type) {
            case 'ADD': addForm(form, new_headers); break;
            case 'EDIT': editForm(form, new_headers); break;
            case 'DELETE': deleteForm(input.ID, new_headers); break;
            default:
                break;
        }
    }

    function addForm(form, headers) {
        axios.post(`http://localhost:5000/file/doc/${docId}/add/character`, form, {headers})
             .then(() => {
                console.log('REACH')
                reloadAll()
             })
    }

    function editForm(form, headers) {
        axios.post(`http://localhost:5000/file/doc/${docId}/edit/character`, form, {headers})
             .then(() => {
                reloadAll()
             })
    }

    function deleteForm(id, headers) {
        console.log('Start deleting...', id)
        axios.post(`http://localhost:5000/file/doc/${docId}/delete/character`, {id}, {headers})
             .then(() => {
                reloadAll()
             })
    }

    return <ReuseForm html_init={html} handleSubmit={handleSubmit}/>
});

function Pagination(props) {
    
    const {handlePage, totalChars, renderPag} = props
    const totalPage = Math.ceil(totalChars / PAGE_SIZE)
    const [pagination, setPagination] = useState(getPagination({totalPage, currentPage: 1, sibling: 2}));
    const [current, setCurrent] = useState(1)

    const id = useId()
    const container = useRef()


    useEffect(() => {
        editUI(1)
        setCurrent(1);
    }, [renderPag])
        


    function move_to(isRight) {
        if ( (isRight && current === totalPage) || (!isRight && current === 1))
            return;  

        const pageNum = isRight ? current + 1 : current - 1

        editUI(pageNum)
        setCurrent(pageNum)
        handlePage(pageNum)
    }

    function getPage(e) {
        let pageNum = e.target.id.split('-')[1]

        if (pageNum === '...')
            return;

        pageNum = parseInt(pageNum);

        // Edit Pagination active state
        editUI(pageNum)
        setCurrent(pageNum);
        handlePage(pageNum);
    }

    function editUI(pageNum) {
        // Edit new Pagination based on the PageNum
        const new_pag = getPagination({totalPage, currentPage: pageNum, sibling: 2})

        // render new pagination
        setPagination(new_pag) 

        // Get array of pagiantion child Nodes.
        // NOTE: Edit directly on the container. (Be aware of extra buttons)
        const childs = container.current.childNodes;

        for (let i = 0; i < childs.length; i++) {
            const childClass = childs[i].className

            // Get PageNum index in the new pagination
            // Ex:  <a> >> </a> Skip this button
            //      <a> 1 </a>
            //      <a> 2 </a>
            const new_idx = new_pag.indexOf(pageNum) + 1 // Plus 1 because of the '>>' button in the container


            // Clear 'active' class for other PageNum (if any)
            childs[i].className = childClass.replace(' active', '');

            // Add an 'active' class to the current PageNum (based on PageNum index)
            if (i === new_idx) {
                childs[new_idx].className  += ' active';
            }
        }
    }

    
    return <div className="pagination" ref={container}>
        <span onClick={() => move_to(false)}>&laquo;</span>
        {pagination.map(
            (pag, i) => {
                const isShow = renderPag && i == 0;
                return <span className={isShow ? ' active' : ''} 
                             key={i} id={`${id}-${pag}`} 
                             onClick={getPage}>{pag}</span>
            }
        )}
        <span onClick={() => move_to(true)}>&raquo;</span>
    </div>
}

async function fetchChars({imgIds, docId, headers}) {
    const chars = Promise.allSettled(
        imgIds.map(
            async (charId) => {
                const {data} = await axios.get(`http://localhost:5000/file/doc/${docId}/character/${charId}`, {headers})
                return data
            }
        )
    )
    // Ex: [
    //     {status: 'fulfilled', value: {base64: ..., type: 'image/png', character: {}} },
    //     ...
    // ]
    return chars
}

async function fetPage({pageNum, docId}) {
    const headers = {Authorization: `Beaer ${getToken()}`};
    return new Promise((resolve, reject) => {
        axios.get(`${FIXED_URL}/file/doc/${docId}/characters/pages/${pageNum}`, {headers})
             .then(({data}) => {
                const result = data.result.character.map(el => ({character: el}))
                // {imgIds: [], total: N, result: [{}, {}, ...]}                    
                resolve({...data, imgIds: data.result.imgIds, result})
             })
            //  .catch(err => reject(err))
    })
}


export default Characters