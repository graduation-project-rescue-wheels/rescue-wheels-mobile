import { createSlice } from "@reduxjs/toolkit";
import { addVehicleAsync, deleteUserAsync, deleteVehicleAsync, loadUserAsync, signInAsync, signOutAsync, signUpAsync, updatePasswordAsync, updateUserAsync } from "./userAsyncThunks";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null
    },
    extraReducers: builder => {
        builder.addCase(signInAsync.fulfilled, (state, action) => {
            state.user = action.payload.userData
            state.accessToken = action.payload.token
        })

        builder.addCase(signOutAsync.fulfilled, (state) => {
            state.user = null
            state.accessToken = null
        })

        builder.addCase(loadUserAsync.fulfilled, (state, action) => {
            state.user = action.payload.userData
            state.accessToken = action.payload.accessToken
        })

        builder.addCase(signUpAsync.fulfilled)

        builder.addCase(updateUserAsync.fulfilled, (state, action) => {
            if (action.payload.isValid) {
                state.user = action.payload.data
            }
        })

        builder.addCase(deleteUserAsync.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = null
            }
        })

        builder.addCase(updatePasswordAsync.fulfilled, (state, action) => {
            state.user = action.payload.data
        })

        builder.addCase(addVehicleAsync.fulfilled, (state, action) => {
            if (action.payload.isValid) {
                state.user = action.payload.data
            }
        })

        builder.addCase(deleteVehicleAsync.fulfilled, (state, action) => {
            if (action.payload.isValid) {
                state.user = action.payload.data
            }
        })
    }
})

export default userSlice.reducer