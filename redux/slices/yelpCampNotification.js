import { createSlice } from "@reduxjs/toolkit"



export const notifications = createSlice({
    name : 'notifications' ,
    initialState : {notification:null},

    reducers:{
        addNotification(state , action){

            state.notification = action.payload.notification
        }

    }
})

export const {addNotification} = notifications.actions

