import {useState, useEffect, useReducer} from 'react'
import {useParams, Link, useNavigate} from 'react-router-dom'
import axios from 'axios'

import Sorting from './sorting'
import Boxes from './boxes'
import Pagination, {getPagination, range} from './pagination'
import Loading from './loading'
import {reducer} from './reducer'

import '../../css/dashboard.scss'
import image from '../../image/download.jfif'

// const init = {
//     boxes: [
//         {
//             id: 1,
//             image: image,
//             title: 'This is a new title asd asd This is a new title asd asd This is a new title asd asd'
//         },
//         {
//             id: 2,
//             image: image,
//             title: 'This is a new title asd asd This is a new title asd asd This is a new title asd asd'
//         }
//     ],
//     isLoading: true,
// }

const init = {
    boxes: [],
    isLoading: true,
    pagination: {
        totalCount: 1,
        pageSize: 20,
    }
}


function Dashboard() {
    const {access_token} = JSON.parse(localStorage.getItem('user'))

    const [data, dispatch] = useReducer(reducer, init)
    let {pageNum} = useParams()
    let navigate = useNavigate()

    const [sortDate, setSortDate] = useState(true)
    const [searchTitle, setSearchTitle] = useState("")

    function openCreatePage() {
        navigate("/create", {state: {code: "tmz"}})
    }

    function changeSearchInput(value) {
        setSearchTitle(value)
    }

    function changeSortDate(isNewest) {
        setSortDate(isNewest)
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source()
        const {pageSize} = data.pagination
        pageNum = !pageNum ? -1 : parseInt(pageNum)

        const request = {pageNum, pageSize, sortDate, searchTitle}
        // console.log(request)
        axios.post('http://localhost:5000/data/get/docs', request,
                {
                    cancelToken: cancelToken.token,
                    headers: { 'Authorization': `Beaer ${access_token}`}
                })
             .then(res => {
                const resData = res.data
                // console.log(resData)
                dispatch({documents: resData.docs, total: resData.total, type: "LOAD_DATA"})
             })
             .catch(err => {
                if (axios.isCancel(err)) {
                    console.log("Request Cancelled!")
                }
                console.log(err)
             })
        
        return () => {
            cancelToken.cancel()
        }
    }, [pageNum, sortDate, searchTitle])

    function toCreatePage() {
        navigate('/create',{state: {id:1,name:'sabaoon'}});
    }

    return <div className='Dashboard'>
    <nav></nav>

    <main className='wrapper'>
        <section className="main">
            <div className='left'>
                <Sorting setSortDate={setSortDate} 
                         changeSearchInput={changeSearchInput} 
                         changeSortDate={changeSortDate}/>

                <div>
                    {/* <button className="form-btn" onClick={openCreatePage}> 
                    + Create a document
                    </button> */}
                    <button className="form-btn" onClick={toCreatePage}> 
                    + Create a document
                    </button>
                </div>
                {/* <div>
                    <Link className="form-btn" to={{pathname: '/create', state: "tmz"}}>
                    + Create a document
                    </Link>
                </div> */}

                {data.isLoading ? <Loading/> : <Boxes boxes={data.boxes}/>}
                {/* {data.isLoading || <Pagination pageNum={pageNum} totalCount={data.boxes.length}/>} */}
                
                {data.isLoading || <Pagination pageNum={pageNum} 
                                                pageSize={data.pagination.pageSize} 
                                                totalCount={data.pagination.totalCount}/>}
                
            </div>
        </section>        
    </main>

    </div>
}



export default Dashboard
