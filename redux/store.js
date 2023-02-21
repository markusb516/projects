import {configureStore} from '@reduxjs/toolkit'
import { cartSlice } from './slices/cartSlice'
import { orderDetailsSlice } from './slices/orderDetailSlice'
import { notifications } from './slices/yelpCampNotification'

const store  = configureStore({
    reducer: {
        cartSlice : cartSlice.reducer,
        orderDetailsSlice : orderDetailsSlice.reducer,
        notificationsSlice : notifications.reducer
    }
})


export default store 