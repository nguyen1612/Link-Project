import { 
        quickSearch,
        sortLinksByDate, 
        sortLinksByAlphabet,  
        filterTags,
        filterLinkByTags, 
        filterGroups, 
        filterLinksByGroups} from "./helper"

export default function reducer(state, action) {

    if (action.type === "LOAD_DATA") {
        // let links = action.data.map(data => {
        //     return data.links.map(link => {
        //         // console.log(link._id)
        //         return {...link, createdAt: new Date(link.createdAt), groupId: data.group._id}
        //     })
        // }).flat()
        // links = links.map(link => {
        //     return {link, isMatched: true, isSelected: true}
        // })
        // // console.log(links)    

        // const groups = action.data.map(data => {return {group: data.group, isMatched: true}})
        // // console.log(groups)

        // let tags = links.map(obj => obj.link.tags).flat()
        // tags = [...new Set(tags.map(obj => obj.name))]
        // tags = tags.map(tag => {
        //     return {name: tag, isMatched: true}
        // })
        // // console.log(tags)
        
        // const newState = {...state, links, tags, groups, isLoading: false}
        // // console.log(action.data)

        const data = action.data
        // console.log(data)

        let links = data.map(obj => {
            const link = obj.group.link;
            return {...link, createdAt: new Date(link.createdAt), groupId: obj.group._id}
        })
        links = links.map(link => ({link, isMatched: true, isSelected: true}))
        // console.log(links)

        let groups = data.map(obj => {
            delete obj.group.link
            return {group: obj.group, isMatched: true}
        })
        groups = [...new Map(groups.map(obj => [obj.group._id, obj])).values()]
        // console.log(groups)

        // let tags = links.map(obj => obj.link.tags).flat()
        // let key = "name"
        // tags = [...new Map(tags.map(obj => [obj[key], obj])).values()]
        // tags = tags.map(tag => ({...tag, isMatched: true}))
        // console.log(tags)

        let tags = action.linkTag.map(tag => ({...tag, isMatched: true}))
        // console.log(tags)

        const newState = {...state, links, tags, groups, isLoading: false}
        // console.log(newState)

        return newState
    }

    if (action.type === "UPDATE_QUICK_SEARCH_INPUT") {
        return {...state, quickSearch: action.value}
    }

    if (action.type === "UPDATE_ADVANCED_SEARCH_INPUT") {
        return {...state, advancedSearch: action.value}
    }





    if (action.type === "QUICK_SEARCH") {
        return quickSearch(state)
    }

    if (action.type === "QUICK_SEARCH_SORT_NEWEST_OLDEST") {
        return sortLinksByDate(state, true)
    }

    if (action.type === "QUICK_SEARCH_SORT_OLDEST_NEWEST") {
        return sortLinksByDate(state, false)
    }

    if (action.type === "QUICK_SEARCH_SORT_ALPHABET_A_Z") {
        return sortLinksByAlphabet(state, true)
    }

    if (action.type === "QUICK_SEARCH_SORT_ALPHABET_Z_A") {
        return sortLinksByAlphabet(state, false)
    }





    if (action.type === "ADVANCED_SEARCH_TAG") {
        const advancedSearch = state.advancedSearch.toUpperCase()
        let newState = filterTags(state, advancedSearch)
        newState = filterLinkByTags(newState)
        return newState
    }

    if (action.type === "ADVANCED_SEARCH_GROUP") {
        const advancedSearch = state.advancedSearch.toUpperCase()
        let newState = filterGroups(state, advancedSearch)
        if (state.appliedGroups.length > 0)
            newState = filterLinksByGroups(newState)
        return newState
    }





    if (action.type === "SELECT_SORT_MODE") {
        return {...state, sortMode: {...action.sortMode}}
    }

    if (action.type === "SELECT_ADVANCED_MODE") {
        const tmp = {...state, advancedMode: {...action.advancedMode}, 
                        appliedTags: [], appliedGroups: []}
        return tmp
    }

    if (action.type === "CHECKED_TAG") {
        const appliedTags = [...state.appliedTags, action.tagName]
        return {...state, appliedTags}
    }

    if (action.type === "UNCHECK_TAG") {
        const appliedTags = state.appliedTags.filter(tag => tag !== action.tagName)
        return {...state, appliedTags}
    }

    if (action.type === "CHECKED_GROUP") {
        const appliedGroups = [action.groupId]
        console.log(appliedGroups)
        return {...state, appliedGroups}
    }

    if (action.type === "UNCHECK_GROUP") {
        // const appliedGroups = state.appliedGroups.filter(tag => tag !== action.groupId)
        // return {...state, appliedGroups}
        return state
    }




    return state
}