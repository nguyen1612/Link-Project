import {Link, NavLink, Navigate} from 'react-router-dom'

const testPag = [
    {currentPage: 5, totalCount: 21, sibling: 3, pageSize: 2},
    {currentPage: 5, totalCount: 20, sibling: 3, pageSize: 2},
    {currentPage: 7, totalCount: 20, sibling: 3, pageSize: 2},

]

function Pagination(props) {
    let {pageNum, totalCount, pageSize} = props

    // Check the url param (must be a number but can have an undefined value - for default page)
    if (!isNaN(pageNum) && !isNaN(parseInt(pageNum)) 
        || pageNum === undefined) 
    {
        // If the page is the default page. Set page number to 1, convert to INT otherwise
        if (pageNum === undefined)
            pageNum = 1
        else
            pageNum = parseInt(pageNum)

        // Define default value for pagination
        // const pageSize = 2
        const totalPage = Math.ceil(totalCount / pageSize)

        // If the url param is not in from 1 to max page. Return Error page
        // URL param detection
        if (pageNum > totalPage || pageNum < 1) {
            return <Navigate to={'/error'} replace />
        }

        // Return an array in pagination format (Ex: [1, '...', 4, 5, 6, '...', 10])
        let pagination = getPagination({
            currentPage: pageNum,
            totalPage,
            sibling: 1
        })

        // Button 'go to page N' detection (both right and left)
        const afterGoleft = pageNum - 1 
        const moveLeft = afterGoleft > 0 ? afterGoleft : 1

        const afterGoRight = pageNum + 1 
        const moveRight = afterGoRight <= totalPage ? afterGoRight : totalPage

        let correctPage
        return <div className="pagination">
            <Link to={`/page/${moveLeft}`}>&laquo;</Link>
            {
                pagination?.map((number, idx) => {
                    if (number === '...') {
                        correctPage = `/page/${pageNum}`
                    } else {
                        correctPage = `/page/${number}`
                    }
                    return <NavLink to={correctPage} 
                                key={idx}
                                >{number}
                            </NavLink>
                })
            }
            <Link to={`/page/${moveRight}`}>&raquo;</Link>
        </div>
    }

    return <Navigate to={'/error'} replace />
}


export function range(start, end) {
    const length = end - start + 1
    return Array.from({length}, (_, idx) => start + idx)
}

export function getPagination(props) {
    const {totalPage, currentPage, sibling} = props

    const pageNumber = 2*sibling + 5
    const DOT = '...'

    const leftSiblingIndex = Math.max(1, currentPage - sibling)
    const rightSiblingIndex = Math.min(totalPage, currentPage + sibling)

    const showLeftDot = leftSiblingIndex > 3
    const showRightDot = rightSiblingIndex < totalPage - 2

    // // Testing purposes
    // console.log(pageNumber)
    // console.log('Inside: ', leftSiblingIndex, rightSiblingIndex)
    // console.log('Inside: ', showLeftDot, showRightDot)
    // console.log('Inside: ', pageNumber, totalPage)
    // console.log('\n')

    if (pageNumber >= totalPage || (!showLeftDot && !showRightDot)) {
        return range(1, totalPage)
    }

    if (!showLeftDot && showRightDot) {
        const leftItemCount = 3 + 2 * sibling
        const leftRange = range(1, leftItemCount)

        return [...leftRange, DOT, totalPage]
    }

    if (showLeftDot && !showRightDot) {
        const rightItemCount = 3 + 2 * sibling
        const rightRange = range(totalPage - rightItemCount + 1, totalPage)

        return [1, DOT, ...rightRange]
    }

    if (showLeftDot && showRightDot) {
        const middle = range(leftSiblingIndex, rightSiblingIndex)

        return [1, DOT, ...middle, DOT, totalPage]
    }
}



export default Pagination