import axios from 'axios'
import {getToken} from '../token'

import {createAsyncThunk} from '@reduxjs/toolkit'

function fetchGet(url) {
    return axios.get(url, {
        headers: {authorization: `Beaer ${getToken()}`}
    })
}

export const fetchDoc = createAsyncThunk('doc/getDoc', async (id) => {
    try {
        const res = await fetchGet(`http://localhost:5000/data/get/doc/${id}`)
        return res.data
    } catch (err) {
        console.log(err)
    }
})

export const fetchAvt = createAsyncThunk('file/image', async (id) => {
    try {
        const {data} = await fetchGet(`http://localhost:5000/file/doc/${id}/avatar`)
        return {base64: data.base64, id: data.id}
    } catch (err) {
        return {base64: undefined, id: undefined}
    }
})