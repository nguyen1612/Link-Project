import { configureStore } from "@reduxjs/toolkit";
import detailSlice from '../component/detail_3/detailSlice'

export default configureStore({
    reducer: {
        detail: detailSlice
    }
})