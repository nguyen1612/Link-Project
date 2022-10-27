import {useState, useEffect, useId} from 'react'
import {useSelector, useDispatch} from 'react-redux' 
import {useParams} from 'react-router-dom'

import { fetchDoc, fetchAvt } from './thunk'

import "../../css/detail_2.scss"

import Info from './child component/info'
import Characters from "./child component/characters"
import Chapters from "./child component/chapters"

import icon1 from "../../image/icon1.jpg"

function Detail() {
    const {docId} = useParams()
    const doc = useSelector(state => state.detail.doc);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDoc(docId))
    }, [])

    if(doc.status !== 'success')
        return

    return <main id="Detail_2">
    <div className="wrapper">
        <Info doc={doc} docId={docId}/>

        <Characters/>

        <Chapters/>
    </div>

    <div className="overlay-2"></div>

    <form className="form-popup">
        <div className="close-wrap">
            <button className="close-btn cl-btn">&times;</button>
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">Name</label>
            <input className="input mt-1" type="text" />
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">Description</label>
            <textarea className="input mt-1" rows="6" type="text" ></textarea>
        </div>
        <div className="flex-end">
            <button className="btn">Add</button>
        </div>
    </form>

    <form className="form-popup">
        <div className="close-wrap">
            <button className="close-btn cl-btn">&times;</button>
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">URL</label>
            <input className="input mt-1" type="text" />
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">Tag</label>
            <div className="inline-input-btn mb-2 mt-1">
                <input className="input" type="text" />
                <button className="btn">Add</button>
            </div>
        </div>
        
        <div className="options">
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
        </div>

        <div className="flex-start wrap tags gap-1 mt-1">
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
        </div>

        <div className="flex-end mt-1">
            <button className="btn">Apply</button>
        </div>
    </form>
    </main>
}

export default Detail