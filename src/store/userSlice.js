import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn } from "../api/user";
import showToast from "../components/Toast";

export const signInAsync = createAsyncThunk('user/signInAsync', async ({ email, passowrd }) => {
    const response = await signIn(undefined, email, passowrd)

    if (response.status === 200) {
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