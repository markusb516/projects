import styles from '../../styles/cartOverlay.module.css'
import { useState, useEffect } from 'react'
import CartItem from './CartItem.js'
import { useSelector, useDispatch } from 'react-redux'
import { removeAll } from '../../redux/slices/orderDetailSlice'
import { closer } from '../../redux/slices/cartSlice'
import { v4 as uuidv4 } from 'uuid';

export default function CartOverlay() {
    const showCartOverlay = useSelector((state) => state.cartSlice.overlay)
    const dispatch = useDispatch()
    const order = useSelector((state) => state.orderDetailsSlice.orders)
    const orderPrice = useSelector((state) => state.orderDetailsSlice.orderPrice)
    const [currentOrder, setCurrentOrder] = useState([])
    const [currOrderPrice, setCurrentOrderPrice] = useState(0)

    const [orderMessage,setOrderMessage] = useState(false)

    function close(){
        dispatch(closer())
    }

    
    function orderAndPriceHandlerAdd(addToPrice, newOrder) {

        setCurrentOrderPrice((state) => {

            sessionStorage.setItem("orderPrice", Number(sessionStorage.getItem('orderPrice')) + addToPrice)

            return Number(state) + addToPrice
        })
        setCurrentOrder(newOrder)

    }
    function orderAndPriceHandlerSub(subToPrice, newOrder) {

        setCurrentOrderPrice((state) => {
            sessionStorage.setItem("orderPrice", Number(sessionStorage.getItem('orderPrice')) - subToPrice)

            return Number(state) - subToPrice
        })
        setCurrentOrder(newOrder)
    }
    useEffect(() => {
        
        if (orderPrice !== 0) {
            if (!sessionStorage.getItem('orderPrice')) {
                sessionStorage.setItem('orderPrice', orderPrice)
                sessionStorage.setItem('order', JSON.stringify(order))
                setCurrentOrderPrice(sessionStorage.getItem('orderPrice'))
                setCurrentOrder(JSON.parse(sessionStorage.getItem('order')))


            }
            else {
                let holder = JSON.parse(sessionStorage.getItem('order'))
                let holder2 = []
                sessionStorage.setItem('orderPrice', orderPrice + Number(sessionStorage.getItem('orderPrice')))
                holder.push(...order)

                for (let obj of holder) {
                    for (let obj2 of holder) {

                        if (holder.indexOf(obj) === holder.indexOf(obj2)) {
                            continue
                        }
                        else {
                            if (obj.id === obj2.id) {

                                holder[holder.indexOf(obj)].qty += obj2.qty

                                holder.splice(holder.indexOf(obj2), 1)

                            }

                        }
                    }
                }

                sessionStorage.setItem('order', JSON.stringify([...holder]))
                setCurrentOrderPrice(sessionStorage.getItem('orderPrice'))
                setCurrentOrder(JSON.parse(sessionStorage.getItem('order')))

            }
        }

        if (currOrderPrice === 0 || currOrderPrice === null) {
            setCurrentOrderPrice(sessionStorage.getItem('orderPrice'))
            setCurrentOrder(JSON.parse(sessionStorage.getItem('order')))

        }

        dispatch(removeAll())



    }, [orderPrice])

    function completeOrder(){
        if (currOrderPrice>0){
            setOrderMessage('sucess')

        }
        else{
            setOrderMessage('error')
        }
    }


    return (

        <div className={showCartOverlay ? `${styles.divBody}` : `${styles.hidden}`} >
            <div className={`${styles.cartBody} container`}>
                {currentOrder ? currentOrder.map((e) => <CartItem updateAdd={orderAndPriceHandlerAdd} updateSub={orderAndPriceHandlerSub} key={uuidv4()} id={e.id} name={e.name} price={e.price} qty={e.qty} />) : null}
                <div className='text-center'>
                    <h1>order price ${currOrderPrice}.00 </h1>


                    {orderMessage === "sucess"? <div className='d-block'>
                    <p className='fs-1 d-inline me-2'>Thank you for your order!</p> 
                    <button onClick={()=>{setOrderMessage(false)}} className='btn py-0 px-2 btn-danger'>x</button> 
                    </div> : null}


                    {orderMessage ==="error" ? <div className='d-block'>
                    <p className='fs-1 d-inline me-2'>Cart is empty</p> 
                    <button onClick={()=>{setOrderMessage(false)}} className='btn py-0 px-2 btn-danger'>x</button> 
                    </div> : null}



                    <button onClick={close} className='border border-dark me-3 btn btn-light rounded-pill py-1 px-4'>Close</button>
                    <button onClick={completeOrder} className='border border-dark btn btn-success rounded-pill py-1 px-4'>Order</button>
                </div>
            </div>
        </div>

    )
}