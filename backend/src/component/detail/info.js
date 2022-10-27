import {useState, useEffect, useReducer} from 'react'
import axios from 'axios'

import { getToken } from '../token'

import solo_level_img from '../../image/solo_leveling.png'


const init = {
    title: "Manga Name",
    description: `qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe
    qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe
    qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe
    qwe qwe qwe qwe123123 aweqw eqwe 123qweq weqweqwe qweqweqwe qweq qq qq qwe`,
    tags: [],
    groups: [],
    image: solo_level_img,
}

function Info(props) {
    const {docId} = props

    // Generate default data
    const max = 95
    for (let i = 0; i < max; i++) {
        init.tags[i] = {name: `Manhwa ${i}`}
    }
    console.log(init)

    const [data, setData] = useState(init)


    useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        axios.get(`http://localhost:5000/data/get/doc/${docId}`, {
                    cancelToken: cancelToken.token,
                    headers: {Authorization: `Bear ${getToken()}`}
                })
             .then(res => {
                const resData = res.data
                console.log(resData)
                setData({...data, title: resData.title, description: resData.description, tags: resData.tags})
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


    return <section id="info-block">
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
}

export default Info