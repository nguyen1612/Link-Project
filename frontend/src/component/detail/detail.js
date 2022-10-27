import {useEffect, useState, useReducer} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

import axios from 'axios'

import { getToken } from '../token'


import Data from './data'
// import AddTag from './AddTag'
// import Info from './info'

import '../../css/detail.scss'
import solo_level_img from '../../image/solo_leveling.png'


const init = {
    title: "Manga Name",
    description: `qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe
    qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe
    qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe
    qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe`,
    tags: [],
    groups: ["qwe"],
    image: solo_level_img,
    isLoading: true,
}

function Detail() {
    const {docId} = useParams()
    const navigate = useNavigate()

    const [data, setData] = useState(init)
    const [linkTag, setLinkTag] = useState([])


    useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        axios.get(`http://localhost:5000/data/get/doc/${docId}`, {
                    cancelToken: cancelToken.token,
                    headers: {Authorization: `Bear ${getToken()}`}
                })
             .then(res => {
                const docData = res.data.doc
                const linkTagData = res.data.linkTag
                const tmp = {title: docData.title, 
                    description: docData.description, 
                    tags: docData.tags,
                    // groups: resData.groups
                }
                // console.log(linkTagData)
                setLinkTag(linkTagData)
                setData({...tmp, isLoading: false})
             })
             .catch(err => {
                if (axios.isCancel(err)) {
                    console.log("Request Cancelled!")
                }
                console.log(err)
             })
        return () => {
            cancelToken.cancel()
        }
    }, [docId])


    function toEdit() {
        console.log(docId)
        navigate("/edit", {state: {data, docId}})
    }


    if (data.isLoading) {
        return <h1>Loading</h1>
    }


    return  <div id="Detail">
    <main className="detail">

        {/* <Info docId={docNum}/> */}
    <section id="info-block">
        <div className="avatar">
            <img src={solo_level_img} className="img" alt="" />
            <label htmlFor="myFile" className="btn">Change Image</label>
            <input type="file" id="myFile" style={{display: "none"}} className="ipt-file" name="filename" />
        </div>

        <div className="info">
            <div className="title-block">
                <h3>{data.title}</h3>
            </div>
            <div className="block">
                <span>Tags: </span>
                {
                    data.tags.map(tag => <a className="tag-item color1" key={tag.name}>{tag.name}</a>)
                }
            </div>
            <div className="block">
                <span>Description: </span>
                <p>{data.description}</p>
            </div>
        </div>
    </section>

        <div className="flex-end">
            <button className="btn">Scrape Mode</button>
            <button className="btn">Preview Mode</button>
            <button className="btn" onClick={toEdit}>Edit Info</button>
        </div>
        
        {/* <AddTag docId={docId} tags={data.tags}/> */}
        <Data docId={docId} linkTag={linkTag} />
        
    </main>

    <footer></footer>
    </div>
}

export default Detail