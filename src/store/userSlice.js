import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn } from "../api/user";
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
    }
})

export default userSlice.reducer
export const { signOut } = userSlice.actions