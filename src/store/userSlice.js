import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import showToast from "../components/Toast";
import * as SecureStore from 'expo-secure-store'
import { signIn, signUp } from "../api/user";

export const signInAsync = createAsyncThunk('user/signInAsync', async ({ email, passowrd }) => {
    const response = await signIn(undefined, email, passowrd)

    if (response.status === 200) {
        await SecureStore.setItemAsync('accessToken', response.data.Token)
        await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.userData))
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
    await SecureStore.deleteItemAsync('currentUser')
})

export const loadUserAsync = createAsyncThunk('user/loadUserAsync', async () => {
    const userData = JSON.parse(await SecureStore.getItemAsync('currentUser'))
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return {
        userData,
        accessToken
    }
})

export const signUpAsync = createAsyncThunk('user/signUpAsync', async ({
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
    DOB
}) => {

    const response = await signUp(firstName, lastName, email, password, mobileNumber, DOB)
    console.log(response.status);
    if (response.status === 201) {
        showToast('User registered successfully')
    } else if (response.status === 409) {
        showToast('Email or Phone number is already exists')
    } else {
        showToast('Something went wrong, Please try again later')
    }
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

        builder.addCase(loadUserAsync.fulfilled, (state, action) => {
            state.user = action.payload.userData
            state.accessToken = action.payload.accessToken
        })
        builder.addCase(signUpAsync.fulfilled)
    }
})

export default userSlice.reducer