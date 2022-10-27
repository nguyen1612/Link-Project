import {useState} from 'react'

function Sorting(props) {
    const {changeSearchInput, changeSortDate} = props
    const [input, setInput] = useState('')

    function handleSubmit(e) {
        e.preventDefault()

        changeSearchInput(input)
        // setInput('')
    }

    function handleInput(e) {
        setInput(e.target.value)
    }

    function handleSortDate(isNewest) {
        changeSortDate(isNewest)
    }

    return <section className="sorting">
    <div className="block-dropdown">
        <div className="dropdown">
            <span href="#" className="dropbtn">Date</span>
            <div className="dropdown-content">
                <span className='drop-child' onClick={() => handleSortDate(true)}>Newest to Oldest</span>
                <span className='drop-child' onClick={() => handleSortDate(false)}>Oldest to Newest</span>
            </div>
        </div>
        {/* <div className="dropdown">
            <span href="#" className="dropbtn">Date</span>
            <div className="dropdown-content">
                <span className='drop-child' onClick={() => handleSortDate(true)}>Newest to Oldest</span>
                <span className='drop-child' onClick={() => handleSortDate(false)}>Oldest to Newest</span>
            </div>
        </div> */}
    </div>
    <form className="block-btn" 
            style={{marginRight: 10}}
            onSubmit={handleSubmit}>
        <input type="text" className="search" 
                value={input}
                onChange={handleInput}/>
        <button type="submit" className="Submit"><i className="fa fa-search"></i></button>
    </form>
    </section>
}

export default Sorting