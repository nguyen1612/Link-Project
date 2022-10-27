export function filterTags(state, advancedSearch) {
    // Filter the tags result by input
    const tags = state.tags.map(tag => {
        const isMatched = tag.name.toUpperCase().indexOf(advancedSearch) > -1
        return {...tag, isMatched}
    })

    return {...state, tags}
}


export function filterLinkByTags(state) {
    // // Filter links result by selected tags
    let links = state.links
    links = links.map(data => {
        let count = 0;
        for (let i = 0; i < state.appliedTags.length; i++) {
            if (data.link.tags.some(tag => tag.name === state.appliedTags[i])) {
                count++;
                if (count === state.appliedTags.length)
                    break
            }
        }

        // If the link' tags have all the applied tags. Set to true
        // Set all the links to true where there are no applied tags. This case, 'count' === 'appliedTags.length'
        const bothMatched = count === state.appliedTags.length
        data['isSelected'] = bothMatched
        data['isMatched'] = bothMatched

        return data
    })

    return {...state, links}
}





export function filterGroups(state, advancedSearch) {
    // Filter groups by input
    const groups = state.groups.map(group => {
        const isMatched = group.group.title.toUpperCase().indexOf(advancedSearch) > -1
        return {...group, isMatched}
    })

    return {...state, groups}
}

export function filterLinksByGroups(state) {
    // // Filter links by selected group
    const links = state.links.map(data => {
        // If the link' groups have all the applied groups. Set to true
        // Set all the links to true where there are no applied groups. This case, 'count' === 'appliedGroups.length'
        const bothMatched = state.appliedGroups[0] === data.link.groupId
        data['isMatched'] = bothMatched;
        data['isSelected'] = bothMatched
        return data
    })
    return {...state, links}
}




export function quickSearch(state) {
    const quickSearch = state.quickSearch.toUpperCase()
    const links = state.links
    let result = []
    let txtValue;

    for (let i = 0; i < links.length; i++) {
        txtValue = links[i].link.title.toUpperCase()
        const isMatched = txtValue.indexOf(quickSearch) > - 1 && links[i]['isSelected']
        result[i] = {...links[i], isMatched}
    } 

    return {...state, links: result}
}

export function sortLinksByDate(state, desc) {
    const {links} = quickSearch(state)
    
    const result = links.sort((a, b) => {
        const link_a = a.link.createdAt
        const link_b = b.link.createdAt
        return desc ? link_b.getTime() - link_a.getTime() : link_a.getTime() - link_b.getTime()
    })

    return {...state, links: result}
}



export function sortLinksByAlphabet(state, asc) {
    const {links} = quickSearch(state)

    const result = links.sort((a, b) => {
        const link_a = a.link.title.toUpperCase()
        const link_b = b.link.title.toUpperCase()
        
        const descending = link_a > link_b ? -1 : link_a < b ? 1 : 0
        const ascending = link_a < link_b ? -1 : link_a > b ? 1 : 0

        return asc ? ascending : descending
    })

    // console.log('\n')

    // result.map(link => {
    //     console.log(link.link._id)
    //     return link
    // })

    // console.log(result)

    return {...state, links: result}
}