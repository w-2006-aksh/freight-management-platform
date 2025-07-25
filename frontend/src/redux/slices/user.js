import { createSlice } from "@reduxjs/toolkit";

export const userSlice=createSlice({
    name:'user',
    initialState:{
        isAuthenticated:false,
        user:{
            name:null,
            role:null,
            email:null,
            _id:null,
        },
       
    },

    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        changeAuthenticationStatus:(state,action)=>{
            state.isAuthenticated=action.payload;
        },

        changeLoadingStats:(state)=>{
            state.isLoading=!state.isLoading
        },

        logout:(state,action)=>{
            state.user={name:null,
            role:null,
            _id:null,
            email:null}
            state.isAuthenticated=false;
        }
    }
})

export const {setUser,changeAuthenticationStatus,logout}=userSlice.actions;

export default userSlice.reducer;