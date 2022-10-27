import {useState, useEffect, useId} from 'react'
import {useSelector, useDispatch} from 'react-redux' 
import {useParams, useNavigate} from 'react-router-dom'

import { fetchDoc, fetchAvt } from '../thunk'
import {  } from '../detailSlice'

import axios from 'axios'
import { getToken } from '../../token'

function toDate(mongoDate) {
    return new Date(mongoDate)
}

const fixedURL = 'http://localhost:5000/data/doc'
function Info(props) {
    const {doc, docId} = props

    const id = useId()
    const navigate = useNavigate()

    function deleteAll() {
        const headers = {Authorization: `Beaer ${getToken()}`}
        console.log(headers)

        axios.get(`${fixedURL}/${docId}/deleteAll`, {headers})
             .then(() => navigate('/'))
             .catch(err => console.log('REACH'))
    }



    const date = toDate(doc.updatedAt)
    const formatted_date = `${date.getHours()}:${date.getMinutes()} ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
    
    let extraFields;
    if (doc?.others) {
        extraFields = [...new Array(Object.keys(doc.others).length)]

        let i = 0;
        for (const key in doc.others) {
            extraFields[i] = <div className="field" key={`${id}-${i}`}>
                <h4 className="field-key">{key}</h4>
                <span className="field-value">{doc.others[key]}</span>
            </div>
            i++;
        }
    }
    
    const tags = doc.tags.map(tag => <span className="tag-item" key={tag._id} id={tag._id}>{tag.name}</span>)
    console.log(doc.tags)

    return <section className="info-wrap">
    <div className="info">
        <Avatar docId={docId}/>

        <div className="right">
            <div className="flex-center fl-column">
                <h3>{doc.title}</h3>
                <time className="time">{formatted_date}</time>
            </div>

            <div className="flex-end">
                <button className="btn ml-1 mr-1">Edit</button>
                <button className="btn ml-1 mr-1" onClick={deleteAll}>Remove Document</button>
            </div>

            <div className="ext-info">
                <div className="ext-field">{extraFields}</div>

                <div className="tag-field">
                    <h4>Tags</h4>
                    <div className="tags">{tags}</div>
                </div>
            </div>
        </div>
    </div>
</section>
}

function Avatar(props) {
    const {docId} = props

    const [image, setImage] = useState({})
    const [imageId, setImageId] = useState(image.id);

    // Get Avatar only when Avatar's ID is changed (Edit)
    useEffect(() => {
        (async () => {
            const {data} = await axios.get(`http://localhost:5000/file/doc/${docId}/avatar`, {
                headers: {authorization: `Beaer ${getToken()}`}
            })
            setImage({base64: data.base64, id: data.id, type: data.type})
        })();
    }, [imageId])


    function selectImage(e) {
        // Maxium of 2MB size
        if (e.target.files[0].size > 2000000) {
            alert("You reach maximum of 2MB. Please try again!")
            return;
        }

        const avtId = image.id ? image.id : "tmp"
        const form = new FormData()
        form.append('file', e.target.files[0]);

        (async () => {
            const {data} = await axios.post(`http://localhost:5000/file/edit/docAvatar/${docId}/${avtId}`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Beaer ${getToken()}`
                }
            })
            setImageId(data.id);
        })();
    }


    return <div className="left">
        <img className="info-avt" src={`data:${image.type};base64,${image.base64 ? image.base64 : ""}`} alt="" />
        <label htmlFor="files" className="btn">Select Image</label>
        <form encType="multipart/form-data">
            <input id="files" style={{visibility: "hidden" }} type="file" name="file" onChange={selectImage}/>
        </form>
    </div>
}

export default Info