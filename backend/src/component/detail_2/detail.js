import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
    fncs, fetchData, 
    tmp1, tmp3 
} from './detailSlice'

import "../../css/detail_2.scss"

import trash from "../../image/trash.png"
import solo_leveling from "../../image/solo_leveling.png"
import reload from "../../image/reload.png"
import plus from "../../image/plus.png"
import icon1 from "../../image/icon1.jpg"
import cancel from "../../image/cancel.png"
import edit from "../../image/edit.png"

function Detail() {
    const data = useSelector(state => state.detail)
    const dispatch = useDispatch()

    // console.log(fncs.update('asd'))
    useEffect(() => {
        // dispatch(fncs.update(true))
        // dispatch(fncs.add('Nguyen'))
        // dispatch(fncs.add('Nguyen'))

        // if (data.status === false) {
            // console.log(fetchData('asd'))
            // dispatch(fetchData())
        // }

        // dispatch(tmp1('asd')) 
        // dispatch(tmp3('asd')) 
        // console.log(tmp3)

        
        // (async () => {
        //     try {
        //         const tmp = await dispatch(fetchData()).unwrap()
        //         console.log(tmp)
        //     } catch(err) {
        //         console.log(err)
        //     }
        // })();


        (async () => {
            try {
                const tmp = await dispatch(tmp3()).unwrap()
                console.log(tmp)
            } catch(err) {
                console.log(err)
            }
        })();
    }, [])
    // console.log(data)


    return <main id="Detail_2">
    <div className="wrapper">
        <section className="info-wrap">
            <div className="info">
                <div className="left">
                    <img className="info-avt" src={solo_leveling} alt="" />
                    <label htmlFor="files" className="btn">Select Image</label>
                    <input id="files" style={{visibility: "hidden" }} type="file" />
                </div>
    
                <div className="right">
                    <div className="flex-center fl-column">
                        <h3>New manga released</h3>
                        <time className="time">06:57 12/10/2022</time>
                    </div>

                    <div className="flex-end">
                        <button className="btn">Add</button>
                        <button className="btn ml-1 mr-1">Edit</button>
                    </div>
    
                    <div className="ext-info">
                        <div className="ext-field">
                            <div className="field">
                                <h4 className="field-key">Auhtor</h4>
                                <span className="field-value">asdqwe qwe qw eq we q we qwe</span>
                            </div>
                            <div className="field">
                                <h4 className="field-key">Tinh Trang asdasd asdas</h4>
                                <span className="field-value"> we q we qwe</span>
                            </div>
                            <div className="field">
                                <h4 className="field-key">Auhtor</h4>
                                <span className="field-value">asdqwe qwe qw eq we q we Hello baby nhaasdqwe qwe qw eq</span>
                            </div>
                            <div className="field">
                                <h4 className="field-key">Tinh Trang</h4>
                                <span className="field-value"> we q we qwe</span>
                            </div>
                            <div className="field">
                                <h4 className="field-key">Auhtor</h4>
                                <span className="field-value">asdqwe qwe qw eq we q we qwe</span>
                            </div>
                            <div className="field">
                                <h4 className="field-key">Tinh Trang</h4>
                                <span className="field-value"> we q we qwe</span>
                            </div>
                        </div>
    
                        <div className="tag-field">
                            <h4>Tags</h4>
                            <div className="tags">
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1 asdqw </span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                                <span className="tag-item">Tag 1</span>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
        </section>

        <section className="info-wrap">
            <div className="show-char">
                <div style={{width: "100%"}}>
                    <h3>Chatacters</h3>
                </div>

                <div className="characters">

                    <div className="character">
                        <label htmlFor="files" className="hover">
                            <img className="char-img" src={solo_leveling}  alt="" />
                        </label>
                        <input id="files" style={{display: "none"}} type="file" />

                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description</div>
                    </div>

                    <div className="character">
                        <img className="char-img" src={solo_leveling}  alt="" />
                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description Small Description Small Description</div>
                    </div>
                    <div className="character">
                        <img className="char-img" src={solo_leveling}  alt="" />
                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description Small Description Small Description</div>
                    </div>
                    <div className="character">
                        <img className="char-img" src={solo_leveling}  alt="" />
                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description</div>
                    </div>
                    <div className="character">
                        <img className="char-img" src={solo_leveling}  alt="" />
                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description Small Description Small Description</div>
                    </div>
                    <div className="character">
                        <img className="char-img" src={solo_leveling}  alt="" />
                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description Small Description Small Description</div>
                    </div>
                    <div className="character">
                        <img className="char-img" src={solo_leveling}  alt="" />
                        <h4 className="txt-ct">Char 1</h4>
                        <div className="char-desc">Small Description Small Description Small Description</div>
                    </div>
                </div>
        
                <div className="pagination">
                    <span href="#">&laquo;</span>
                    <span href="#">1</span>
                    <span href="#" >2</span>
                    <span href="#">3</span>
                    <span href="#" className="active">4</span>
                    <span href="#">5</span>
                    <span href="#">6</span>
                    <span href="#">7</span>
                    <span href="#">&raquo;</span>
                </div>
            </div>
        </section>

        <section className="info-wrap">
            <div className="chapters">
                <div className="search-chapters">
                    <form action="">
                        <label className="label" htmlFor="search-tags">Search Tags</label>
                        <div className="inline-input-btn mt-1 mb-1">
                            <input className="input" type="text" />
                            <button className="btn">Search</button>
                        </div>
                    </form>

                    <div className="inline-btns flex-start">
                        <div className="icon-wrap-2">
                            <img className="icon-btn-1" src={reload} alt="" />
                        </div>
                        <div className="icon-wrap-2">
                            <img className="icon-btn-1" src={plus}  alt="" />
                        </div>
                        <div className="icon-wrap-1">
                            <img className="icon-btn-1" src={trash} alt="" />
                        </div>
                    </div>
                    
                    <div className="flex-end mb-2">20 Result Found.</div>

                    <div className="options">
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />

                            <form style={{width: "100%"}}>
                                <input type="text" className="input-name tag-input" id="abc" name="xyz" />
                            </form>
                            
                            {/* <label className="tag-name" htmlFor="1">
                                HELLO a asd asd qweasd asd asd
                            </label> */}

                            <label className="checkbox-wrap show" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark red"></span>
                            </label>
                        </div>

                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap show" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap show" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                        <div className="option grey">
                            <img src={icon1} alt="" className="tag-icon" />
                            <label className="tag-name" htmlFor="1">HELLO a asd asd qweasd asd asd
                            </label>

                            <label className="checkbox-wrap" htmlFor="1">
                                <input type="checkbox" id="1" className="checkbox-input" />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>

                    <div className="flex-end mt-2">
                        <button className="btn">Apply</button>
                    </div>

                    <label className="label" htmlFor="tag-desc">Tag Description</label>
                    <p id="tag-desc" className="tag-desc mt-2">Lorem ipsum dolor sit amet, consectetur adipiscingelit.elit. 
                        Cras sollicitudin venenatis malesuada. Mauris vel blandit enim. Etiam dignissim sapien eget turpis varius, id varius massa laoreet. Vestibulum vel purus at dui hendrerit auctor. Morbi blandit id purus eu commodo. 
                        Nunc a pellentesque nisl. Donec lobortis facilisis justo, ut ultrices felis. Cras vitae aliquet urna, pharetra tristique urna. 
                        Curabitur vitae erat tempus, semper ligula ac, cursus diam. Sed tortor ante, imperdiet non arcu ac, vestibulum accumsan eros. 
                        Donec id mauris laoreet, tristique diam eget, vestibulum nibh. Vivamus porta metus id sodales imperdiet. 
                        Integer molestie erat est, vitae porta sem pretium eu. Duis nec fermentum sapien. Pellentesque id viverra nisl.e</p>
                </div>

                <div className="display-chapters">
                    <div className="search-tag">
                        <form action="">
                            <label className="label" htmlFor="search-tags">Search Tags</label>
                            <div className="inline-input-btn mt-1 mb-1">
                                <input className="input" type="text" />
                                <button className="btn">Search</button>
                            </div>
                        </form>
    
                        <div className="inline-btns flex-start">
                            <div className="icon-wrap-2">
                                <img className="icon-btn-1" src={reload} alt="" />
                            </div>
                            <div className="icon-wrap-2">
                                <img className="icon-btn-1" src={plus}  alt="" />
                            </div>
                        </div>

                        <div className="flex-end mb-2">60 Result Found.</div>
    
                        <div className="options-2">
                            <div className="option-2 grey">
                                <form style={{width: "100%"}}>
                                    <input type="text" className="input-name"  id="abc" name="xyz" />
                                </form>
    
                                {/* <!-- <label className="tag-name" htmlFor="1"> -->
                                    <!-- <img src={icon1} alt="" className="tag-icon" /> -->
                                    <!-- HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd -->
                                <!-- </label> --> */}
    
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd 
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd 
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                            <div className="option-2 grey">
                                <label className="tag-name" htmlFor="1">
                                    
                                    HELLO a asd asd qweasd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd HELLO a asd asd qweasd asd asd
                                </label>
                                <div className="inline-btns flex-end">
                                    <div className="icon-wrap-2">
                                        <img className="icon-btn-2" src={edit}  alt="" />
                                    </div>
                                    <div className="icon-wrap-1">
                                        <img className="icon-btn-2" src={trash} alt=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

    <div className="overlay-2"></div>

    <form className="form-popup">
        <div className="close-wrap">
            <button className="close-btn cl-btn">&times;</button>
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">Title</label>
            <input className="input mt-1" type="text" />
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">Description</label>
            <textarea className="input mt-1" rows="6" type="text" ></textarea>
        </div>
        <div className="flex-end">
            <button className="btn">Add</button>
        </div>
    </form>

    <form className="form-popup">
        <div className="close-wrap">
            <button className="close-btn cl-btn">&times;</button>
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">URL</label>
            <input className="input mt-1" type="text" />
        </div>
        <div className="mb-2">
            <label htmlFor="1" className="label">Tag</label>
            <div className="inline-input-btn mb-2 mt-1">
                <input className="input" type="text" />
                <button className="btn">Add</button>
            </div>
        </div>
        
        <div className="options">
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
            <div className="option grey">
                <img src={icon1} alt="" className="tag-icon" />
                <label className="tag-name" htmlFor="2">HELLO a asd asd qweasd asd asd
                </label>

                <label className="checkbox-wrap show" htmlFor="2">
                    <input type="checkbox" id="2" className="checkbox-input" />
                    <span className="checkmark"></span>
                </label>
            </div>
        </div>

        <div className="flex-start wrap tags gap-1 mt-1">
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
            <a href="" className="tag-item">Tag 1
                <span className="delete">x</span>
            </a>
        </div>

        <div className="flex-end mt-1">
            <button className="btn">Apply</button>
        </div>
    </form>
    </main>
}

export default Detail