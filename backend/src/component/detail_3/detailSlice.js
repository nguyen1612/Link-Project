import { createSlice } from '@reduxjs/toolkit'

import { fetchDoc, fetchAvt } from './thunk'

const { actions, reducer } = createSlice({
    name: "chapter",
    initialState: {
        doc: {
            image: {},
            status: 'idle'
        },
        chapters: {},
        tags: {}
    },
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(fetchDoc.pending, (state, action) => {
                console.log('Doc Pending')
                state.doc.status = 'pending';
            })
            .addCase(fetchDoc.fulfilled, (state, action) => {
                state.doc = {...state.doc, ...action.payload}
                state.doc.status = 'success'
            })
            .addCase(fetchAvt.pending, (state, action) => {
                state.doc.image.status = 'pending';
            })
            .addCase(fetchAvt.fulfilled, (state, action) => {
                state.doc.image.base64 = action.payload.base64
                state.doc.image.id = action.payload.id
                state.doc.image.status = 'success'
            })
    }
})





export const fnc = {...actions}
export default reducer