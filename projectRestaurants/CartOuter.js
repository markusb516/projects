import styles from '../../styles/restaurant.module.css'
import CartInner from './CartInner.js'
import { useSelector, useDispatch } from 'react-redux'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { decrement , show} from '../../redux/slices/cartSlice'


export default function CartOuter() {

    const dispatch = useDispatch()
    const storeCount = useSelector((state) => state.cartSlice.count)
    const refresh = useSelector((state) => state.cartSlice.overlay)

    const [countHolder, setCountHolder] = useState(null)
    const [count, setCount] = useState(null)


    function showCartOverlay(){
        dispatch(show())
    }

    useEffect(() => {
   
        if (storeCount !== 0) {
            if (!sessionStorage.getItem('cartCount')) {
                sessionStorage.setItem('cartCount', storeCount)
                setCountHolder((state)=>sessionStorage.getItem('cartCount'))
            }
            else {
                sessionStorage.setItem('cartCount', storeCount + Number(sessionStorage.getItem('cartCount')))
                setCountHolder((state)=>sessionStorage.getItem('cartCount'))
            }
        }

        if (countHolder === 0 || countHolder === null) {
            setCountHolder((state)=>sessionStorage.getItem('cartCount'))
        }

        dispatch(decrement({ count: storeCount }))
        setCount(sessionStorage.getItem('cartCount'))
        
    },
        [storeCount,refresh])
    return (

        <div  onClick={showCartOverlay}  className={`rounded-4 px-4 ${styles.cartOuter} w-50 container mt-4 mb-3 me-4 d-inline-block`}>
            <div className='row'>
                <div className='col'>
                    <Image
                        src="/images_Restaurant/shopping-cart.png"
                        alt='shopping cart'
                        height={35}
                        width={50}
                        className={`mt-2 me-4`}
                    />
                </div>
                <div className='col'>
                    <CartInner count={count} refresh = {refresh} />
                </div>
            </div>
        </div>
    )
}