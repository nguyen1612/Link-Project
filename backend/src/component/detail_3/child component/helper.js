import { useEffect, useState } from "react";
import trash from "../../../image/trash.png"
import reload from "../../../image/reload.png"
import plus from "../../../image/plus.png"
import icon1 from "../../../image/icon1.jpg"
import edit from "../../../image/edit.png"

export function ReuseForm(props) {
    {/* 
    init: {
        inputFields: [{key: "", attrs: {}}, ...],
        textFields: [{key: "", attrs: {}}, ...],
        fileFields: [{key: "", attrs: {container, ...}}, ...]
    }
    */}
    const { html_init, handleSubmit  } = props
    const [input, setInput] = useState(html_init);

    useEffect(() => {
        setInput(html_init)
    }, [html_init])

    function getSubmit(e) {
        e.preventDefault();
        setInput(html_init);

        // Proccess input before and callback
        let result = {}
        result.fileFields = input?.fileFields?.map(file => {
            const {key, attr} = getKey(file)
            return {id: file.id, [key]: file[key], container: attr.container}
        })
        result.textFields = input?.textFields?.map(field => {
            const {key} = getKey(field)
            return {[key]: field[key]}
        })
        result.inputFields = input?.inputFields?.map(input => {
            const {key} = getKey(input)
            return {[key]: input[key]}
        })

        const txtFields = result?.textFields ? result.textFields : [{}]
        const inputFields = result?.inputFields ? result.inputFields : [{}]
        const type = input?.type
        const _id = input?._id

        let final_result = Object.assign(
            {}, 
            {type, _id},
            ...txtFields,
            ...inputFields,
            // ...result?.textFields, 
            // ...result?.inputFields, 
            {fileFields: result?.fileFields}
        )

        handleSubmit(final_result)
    }

    function changeInput(e, type, idx) {
        const copy = [...input[type]]
        copy[idx] = {...copy[idx]}
        copy[idx][e.target.name] = type !== 'fileFields' ? e.target.value : e.target.files[idx];

        setInput({...input, [type]: copy})
    }

    // Pre-process
    const inputFields = input?.inputFields?.map((input, idx) => {
        const {key, attr} = getKey(input)
        const name = UpperCase_First(key)
        return <div className="mb-1" key={idx}>
            <label htmlFor="1" className="label">{name}</label>
            <input className="input mt-1" type="text" maxLength={attr.maxLength} name={key} required={attr.required}
                    value={input[key]} 
                    onChange={e => changeInput(e, 'inputFields', idx)}/>
        </div>
    })

    const textFields = input?.textFields?.map((field, idx) => {
        const {key, attr} = getKey(field)
        const name = UpperCase_First(key)
        return <div className="mb-1" key={idx}>
            <label htmlFor="1" className="label">{name}</label>
            <textarea className="input mt-1" type="text" rows={attr.rows} maxLength={attr.maxLength} name={key} required={attr.required}
                    value={field[key]} 
                    onChange={e => changeInput(e, 'textFields', idx)}></textarea>
        </div>
    })

    const fileFields = input?.fileFields?.map((file, idx) => {
        const {key, attr} = getKey(file);
        
        return <input id="char1" type="file" key={idx} name={key} required={attr.required} 
                      onChange={e => changeInput(e, 'fileFields', idx)} ref={attr.container}/>
    })

    return <form className="mb-2" onSubmit={getSubmit} encType={input.multiparts ? "multipart/form-data" : ''}>
        {inputFields}
        {textFields}
        {fileFields}
        <div className="flex-end">
            <button className="btn">{input.type}</button>
        </div>
    </form>
}



export function formatInput({html_init, input}) {
    let result = {}
    result.fileFields = html_init?.fileFields.map(obj => {
        const {key, attr} = getKey(obj)
        return {...obj, id: input.imageId, [key]: input[key], container: attr.container}
    })
    result.textFields = html_init?.textFields.map(obj => {
        const {key} = getKey(obj)
        return {...obj, [key]: input[key]}
    })
    result.inputFields = html_init?.inputFields.map(obj => {
        const {key} = getKey(obj)
        return {...obj, [key]: input[key]}
    })
    return {...input, ...html_init, ...result};
}

export function getKey(obj) {
    let key = Object.keys(obj).filter(name => name !== 'attrs' && name !== 'id')
    if (key > 0)
        return false
    key = key[0]
    const attr = obj.attrs
    return {key, attr}
}

export function validateFile(file, condition) {
    const {
        maxSize = 2000000, support_type, 
        alert_maxSize, alert_supportType
    } = condition

    // User must select a file and size with maximum of 2MB.
    if (!file   || (Object.keys(file).length == 0 
                && Object.getPrototypeOf(file) === Object.prototype
                || file.size > maxSize)) {
        if (alert_maxSize)
            alert(alert_maxSize);
        return false
    }

    if (support_type !== undefined && typeof support_type !== typeof Array && support_type.length <= 0)
        return false


    // Must be an image file
    const extension = file.type.split('/')[1]
    if (!support_type.includes(extension)) {
        // const show_types = support_type.map(t => ` ${t.toUpperCase()}`)
        if (alert_supportType)
            alert(alert_supportType);
        return false
    }


    return true
}

export function UpperCase_First(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function fomratChars({chars_img, chars_txt}) {
    let chars = [...new Array(chars_txt.length)]

    for (let i=0; i<chars_txt.length; i++) {
        const char_img = chars_img[i].value
        const char_txt = chars_txt[i].character

        if (char_txt._id !== char_img._id) {
            console.error('Not Match!')
            console.log(chars_txt[i].character._id)
            console.log(chars_img[i].value._id)
            return;
        } else {
            chars[i] = {character: char_txt, ...char_img}
        }
    }

    return chars
}

export function getPagination(props) {
    function range(start, end) {
        const length = end - start + 1
        return Array.from({length}, (_, idx) => start + idx)
    }

    const {totalPage, currentPage, sibling} = props

    const pageNumber = 2*sibling + 5
    const DOT = '...'

    const leftSiblingIndex = Math.max(1, currentPage - sibling)
    const rightSiblingIndex = Math.min(totalPage, currentPage + sibling)

    const showLeftDot = leftSiblingIndex > 3
    const showRightDot = rightSiblingIndex < totalPage - 2

    // // Testing purposes
    // console.log(pageNumber)
    // console.log('Inside: ', leftSiblingIndex, rightSiblingIndex)
    // console.log('Inside: ', showLeftDot, showRightDot)
    // console.log('Inside: ', pageNumber, totalPage)
    // console.log('\n')

    if (pageNumber >= totalPage || (!showLeftDot && !showRightDot)) {
        return range(1, totalPage)
    }

    if (!showLeftDot && showRightDot) {
        const leftItemCount = 3 + 2 * sibling
        const leftRange = range(1, leftItemCount)

        return [...leftRange, DOT, totalPage]
    }

    if (showLeftDot && !showRightDot) {
        const rightItemCount = 3 + 2 * sibling
        const rightRange = range(totalPage - rightItemCount + 1, totalPage)

        return [1, DOT, ...rightRange]
    }

    if (showLeftDot && showRightDot) {
        const middle = range(leftSiblingIndex, rightSiblingIndex)

        return [1, DOT, ...middle, DOT, totalPage]
    }
}

export function clearActive(except, allName, newName, container) {
    const childs = container.childNodes;

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

export function clearAll(idx, container) {
    const childs =  container.current.childNodes
    for (let i = 0; i < childs.length; i++) {
        const childs_2 = childs[i].childNodes[1].childNodes;

        if (i !== idx) {
            for (let j = 0; j < childs_2.length; j++) {
                const className = childs_2[j].className
                if (className.includes(" active-1"))
                    childs_2[j].className = className.replace(" active-1", "")
                else
                    childs_2[j].className = className.replace(" active-2", "")
            }
        }
    }
}



export function Loading() {
    return <section className="info-wrap tmp">
        <div className='chapters'>
            <div className="search-chapters">
                <form action="">
                    <label className="label" htmlFor="search-tags">Search Tags</label>
                    <div className="inline-input-btn mt-1 mb-1">
                        <input className="input" type="text"/>
                        <button className="btn">Search</button>
                    </div>
                </form>
                <div className="inline-btns flex-start">
                    <div className="icon-wrap-2">
                        <img className="icon-btn-1" src={reload} alt="" />
                    </div>
                    <div className="icon-wrap-2">
                        <img className="icon-btn-1" src={plus}  alt="" />
                    </div>
                    <div className="icon-wrap-2">
                        <img className="icon-btn-1" src={edit} alt="" />
                    </div>
                    <div className="icon-wrap-1">
                        <img className="icon-btn-1" src={trash} alt="" />
                    </div>
                </div>
                <div className="options"></div>
                <div className="flex-end mt-2">
                    <button className="btn">Apply</button>
                </div>
                <label className="label" htmlFor="tag-desc">Tag Description</label>
                <p id="tag-desc" className="tag-desc mt-2">Lorem ipsum dolor sit amet, consectetur adipiscingelit.elit. 
                    Cras sollicitudin venenatis malesuada. Mauris vel blandit enim. Etiam dignissim</p>
            </div>
            <div className="display-chapters">
                <div className="search-tag">
                    <form action="">
                        <label className="label" htmlFor="search-tags">Search Tags</label>
                        <div className="inline-input-btn mt-1 mb-1">
                            <input className="input" type="text" />
                            <button className="btn">Search</button>
                        </div>
                    </form>
                    <div className="inline-btns flex-start">
                        <div className="icon-wrap-2">
                            <img className="icon-btn-1" src={reload} alt="" />
                        </div>
                        <div className="icon-wrap-2">
                            <img className="icon-btn-1" src={plus}  alt="" />
                        </div>
                    </div>
                    <div className="options-2">
                        <div className="option-2 grey">
                            <label className="tag-name" htmlFor="1">
                                -------------------------------------------------------------------------------------------------------------------
                            </label>
                            <div className="inline-btns flex-end">
                                <div className="icon-wrap-2">
                                    <img className="icon-btn-2" src={edit}  alt="" />
                                </div>
                                <div className="icon-wrap-1">
                                    <img className="icon-btn-2" src={trash} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="overlay-tmp show"></div>
        <div className="loading">
            <div className="loader">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div>
        </div>
    </section>
}