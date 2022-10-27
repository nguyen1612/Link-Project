import {Link} from 'react-router-dom'

function Boxes(props) {
    const {boxes} = props

    return <div className="boxes">
        
    {
        boxes.map((box) =>
            <div className="box-detail" key={box.id}> 
                <Link to={`/doc/${box.id}`} className='box-link'>
                    <img className={`box-img ${box.image ? box.image : "defaultColor"}`} src={box.image} alt="" />
                </Link>
                <Link to={`/doc/${box.id}`} className='box-link'>
                    <div className='block-box-title'>
                        <h4 className="box-title">{box.title}</h4>
                    </div>
                </Link>
            </div>
        )
    }
    </div>
}

export default Boxes