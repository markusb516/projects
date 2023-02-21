import { createSlice } from '@reduxjs/toolkit'

export const orderDetailsSlice = createSlice({
    name: 'orderDetails',
    initialState: {
        orders: [],
        orderPrice: 0
    },
    reducers: {
        addOrder(state, action) {
            const holder = []

            if (!state.orders.length) {
                
                state.orders = [action.payload]
                state.orderPrice = Number(action.payload.price)
            }

            // -------------------------------------------------------------

            else {
                for (let item of state.orders) {
                    if (item.id === action.payload.id) {
                        item.qty += action.payload.qty
                        state.orders = [...state.orders, item]
                    }
                    else if (item.id !== action.payload.id) {
                        state.orders = [...state.orders, action.payload]

                    }




                }
            }
            state.orders = state.orders.filter((item) => {

                const duplicate = holder.includes(item.id)

                if (!duplicate) {
                    holder.push(item.id)
                    return true
                }

                return false

            })
            state.orderPrice = Math.round(state.orders.map((item) => item.price * Number(item.qty)).reduce((a, b) => a + b) * 100) / 100











        }
        ,
        subtractOrder(state, action) {
            let holder = []

            for (let item of state.orders) {
                if (item.id === action.payload.id) {
                    item.qty -= action.payload.qty
                    state.orders = [...state.orders, item]
                }
            }


            state.orders = state.orders.filter((item, index) => {

                const duplicate = holder.includes(item.id)

                if (!duplicate) {
                    holder.push(item.id)
                    return true
                }

                return false

            })

            state.orderPrice = Math.round(state.orders.map((item) => item.price * Number(item.qty)).reduce((a, b) => a + b) * 100) / 100

        },

        removeItem(state, action) {

            state.orders = state.orders.filter((item) => { return item.id !== action.payload.id })

            if (state.orders.length >= 1) {
                state.orderPrice = Math.round(state.orders.map((item) => item.price * Number(item.qty)).reduce((a, b) => a + b) * 100) / 100
            }

            else{
                state.orderPrice = 0
            }



        },

        removeAll(state,action){

            state.orders = []
            state.orderPrice = 0

        }




    }
})


export const { addOrder, subtractOrder , removeItem, removeAll} = orderDetailsSlice.actions


