import styles from '../../styles/restaurant.module.css'
import { increment } from '../../redux/slices/cartSlice'
import {useDispatch, useSelector} from 'react-redux'
import { useRef } from 'react'
import {addOrder} from '../../redux/slices/orderDetailSlice'



export default function MenuItem({item, description, price , id}){
  
    const dispatch = useDispatch()
    const qty = useRef()
    const overlay = useSelector((state)=>state.cartSlice.overlay)
   

    function formHandler (event){
        event.preventDefault()
        if(qty.current.value >=1 && overlay === false){
        dispatch(increment({count : qty.current.value}))
        dispatch(addOrder({qty:Number(qty.current.value), id :id, name:item, price:price }))
        }

        else{
            null
        }
    }
    

    
    return(
    
        <div className={`container ${styles.menuBody}` }>
            <div className="row">
                <div className="col" > 
                    <h5 className='fw-bold'>{item}</h5>
                    <p className="fw-semibold">{description}</p>
                    <h3 className={`${styles.price}`}>{price}</h3>
                </div>
                {/* ----------------------------------------------------------------------------------------------- */}
                <div className="col text-end">
                    <form className='mt-1' onSubmit={formHandler} >
                        <label className="me-3 fw-bold">Qty:</label>
                        <input ref={qty} type='number'min='1' />
                        <button className={`d-block ms-auto mt-4 rounded-pill px-5 py-1 ${styles.menuAdd}`}>+ Add</button>
                    </form>
                </div>
            </div>
            <hr />
            </div>
            
            
    )
}