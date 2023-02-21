import {createSlice} from '@reduxjs/toolkit'


export const cartSlice = createSlice({
    name:"cartCount",
    initialState: {count:0,
    overlay: false}
    ,
    reducers:{
        increment(state , action){
            state.count = state.count+= Number(action.payload.count)
        },
        decrement(state , action){
            state.count =  state.count -= Number(action.payload.count) 
        },
        show(state , action){
            state.overlay =  true
        },

        closer(state , action){
            if(state.overlay){
                state.overlay = false
            }
            else{
                null
            }
        },

        setCounter(state , action){
            state.count = action.payload.count
        }
        
    }
})


export const {increment, decrement, show, closer ,  setCounter} = cartSlice.actions


