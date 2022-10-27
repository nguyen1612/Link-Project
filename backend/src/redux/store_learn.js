import {configureStore } from '@reduxjs/toolkit'
import detailReducer from '../component/detail_2/detailSlice'
// import linkSlice from '../component/detail_3/detailSlice'

export default configureStore({
    reducer: {
        detail: detailReducer
    }
})