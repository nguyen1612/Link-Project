import { createSlice, createAsyncThunk, createAction, createReducer } from '@reduxjs/toolkit'


const detailSlice = createSlice({
    name: "detail",
    initialState: {
        users: [],
        status: false,
    },
    reducers: {
        update: (state, action) => {
            state.isLoading = action.payload
        },
        add: {
            reducer: (state, action) => {
                console.log(action)
                state.users.push(action.payload)
            },
            prepare: (name) => ( {payload: {id: 10, name}, error: true} )
        },
        fetchPosts: (state, action) => {
            console.log(action.payload)
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchData.pending, (state, action) => {
                console.log({...fetchData})
                console.log(fetchData.pending())
                state.status = 'pending'
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                console.log(action.payload)
                state.status = 'fulfilled'
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = 'rejected'
            })

            .addCase(tmp1.type, (state, action) => {
                console.log(action)
            })
            .addCase(tmp3.pending, (state, action) => {
                console.log('Pending...')
            })
            .addCase(tmp3.accept, (state, action) => {
                console.log(`Finished! ${action.payload}`)
            })
    }
})

export const fetchData = createAsyncThunk('posts/fetchPosts', async () => {
    return await new Promise((resolve, reject) => {resolve({name: "Hey"})})
})

export const tmp1 = createAction('some_type')

function customThunk(type, asyncFnc) {
    function thunk() {
        return async (dispatch, getState) => {
            dispatch({type: 'type_1/pending'})  
            const result = await asyncFnc()
            dispatch({type: 'type_1', payload: result})
            return asyncFnc()
        }
    }
    
    thunk.accept = createAction(type)
    thunk.pending = createAction(`${type}/pending`)
    return thunk;
}

export const tmp3 = customThunk('type_1', async () => {
    return await new Promise(resolve => resolve({name: 'nguyen'}))
})








// const reducer = createReducer(0, (builder) => {
//   builder
//     .addCase('increment', (state) => state + 1)
//     .addMatcher(
//       (action) => action.type.startsWith('i'),
//       (state) => state * 5
//     )
//     .addMatcher(
//       (action) => action.type.endsWith('t'),
//       (state) => state + 2
//     )
// })

// console.log(reducer(undefined, { type: 'increment' }))









// {update} = detailSlice.actions
export const fncs = {...detailSlice.actions}
export default detailSlice.reducer