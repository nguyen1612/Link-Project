export function reducer(state, action) {
    if(action.type === "LOAD_DATA") {
        const boxes = action.documents
        const total = action.total > 0 ? action.total : 1
        const tmp = {...state, isLoading: false, boxes, pagination: {...state.pagination, totalCount: total}}
        return tmp
    }

    return state
}