import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn } from "../api/user";
import showToast from "../components/Toast";
import * as SecureStore from 'expo-secure-store'

export const signInAsync = createAsyncThunk('user/signInAsync', async ({ email, passowrd }) => {
    const response = await signIn(undefined, email, passowrd)

    if (response.status === 200) {
        await SecureStore.setItemAsync('accessToken', response.data.Token)
        showToast('Welcome to rescue wheels')

        return response.data
    } else {
        showToast('Something went wrong. Please try again later.')

        return {
            userData: null,
            accessToken: null
        }
    }
})

export const signOutAsync = createAsyncThunk('user/signOutAsync', async () => {
    await SecureStore.deleteItemAsync('accessToken')
})

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
    }
})

export default userSlice.reducer