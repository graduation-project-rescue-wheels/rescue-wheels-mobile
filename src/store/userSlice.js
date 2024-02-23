import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn, signUp } from "../api/user";
import Toast from "react-native-root-toast";

export const signInAsync = createAsyncThunk('user/signInAsync', async ({ email, passowrd }) => {
    const response = await signIn(undefined, email, passowrd)

    if (response.status === 200) {
        Toast.show('Welcome to rescue wheels', {
            duration: Toast.durations.LONG
        })
        return response.data
    } else {
        Toast.show('Something went wrong. Please try again later.', {
            duration: Toast.durations.LONG
        })
        return {
            userData: null,
            accessToken: null
        }
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
        Toast.show('User registered successfully', {
            duration: Toast.durations.LONG
        })
    } else if (response.status === 409) {
        Toast.show('Email or Phone number is already exists', {
            duration: Toast.durations.LONG
        })
    } else {
        Toast.show('Something went wrong. Please try again later.', {
            duration: Toast.durations.LONG
        })
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null
    },
    reducers: {
        signOut: (state) => {
            state.accessToken = null
            state.user = null
        }
    },
    extraReducers: builder => {
        builder.addCase(signInAsync.fulfilled, (state, action) => {
            state.user = action.payload.userData
            state.accessToken = action.payload.Token
        })
        builder.addCase(signUpAsync.fulfilled, (state, action) => { })
    }
})

export default userSlice.reducer
export const { signOut } = userSlice.actions