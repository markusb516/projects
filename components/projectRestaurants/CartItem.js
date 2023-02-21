import { useState, useEffect  } from 'react'

export default function CartItem({ name, price, qty, id , updateAdd , updateSub}) {

    const [add, setAdd] = useState(false)
    const [subtraction, setSubtraction] = useState(false)
    const [remove, setRemove] = useState(false)
    

    
    function formHandler(event) {
        event.preventDefault()
    }
    function addition() {
        setAdd(true)
    }

    function subtract() {
        if (qty >= 2) {
            setSubtraction(true)
        }
    }

    useEffect(() => {
        
        if (add === true && subtraction === false) {

            let order = JSON.parse(sessionStorage.getItem('order'))
            let cartCount = Number(sessionStorage.getItem('cartCount'))

            order = order.map((item) => {
                if (item.id === id) {
                    item.qty++
                    return item
                }
                return item
            })
            cartCount += 1;


            updateAdd(price,order)

            sessionStorage.setItem('order', JSON.stringify(order))
            sessionStorage.setItem('cartCount', cartCount)
            
        }


        if (add === false && subtraction === true) {

            let order = JSON.parse(sessionStorage.getItem('order'))
            let cartCount = Number(sessionStorage.getItem('cartCount'))
            

            order = order.map((item) => {
                if (item.id === id) {
                    item.qty--
                    return item
                }
                return item
            })

            cartCount -= 1;

            updateSub(price,order)



            sessionStorage.setItem('order', JSON.stringify(order))
            sessionStorage.setItem('cartCount', cartCount)

        }


        if (remove === true) {

            let order = JSON.parse(sessionStorage.getItem('order'))
            let cartCount = Number(sessionStorage.getItem('cartCount'))
            let newPrice = Number(price) * qty

            order = order.filter((item) => {
                if (item.id !== id) {
                    return true
                }
                return false
            })

            cartCount -= qty;

            

            updateSub(newPrice,order)



            sessionStorage.setItem('order', JSON.stringify(order))
            sessionStorage.setItem('cartCount', cartCount)




        }

        setAdd(false)
        setSubtraction(false)

        

    },
        [add, subtraction,remove,id,price,qty,updateAdd,updateSub])


    function removing() {
        setRemove(true)
    }
    return (
        <>
            <div className="row">
                <div className="col mt-2 ms-3" >
                    <h3 className='fw-bold text-dark'>{name}</h3>
                    <h3>${price}</h3>
                    <button onClick={removing} className='rounded-4 px-3 py-1'>Remove</button>
                </div>

                {/* ----------------------------------------------------------------------------------------------- */}
                <div className="col mt-2 me-3">
                    <form onSubmit={formHandler}>
                        <div className='text-end w-50 ms-auto'>
                            <button onClick={subtract} className='rounded-4  w-50   py-1'>-</button>
                            <button onClick={addition} className='rounded-4 w-50 py-1 mb-3 '>+</button>
                            <div>
                                <h2 className=" d-inline-block ms-auto text-center w-25 border border-dark rounded-4 ">{qty}</h2>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
            <hr />
        </>




    )
}