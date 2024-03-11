import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import showToast, { SMTH_WENT_WRONG } from "../components/Toast";
import * as SecureStore from 'expo-secure-store'
import { addVehicle, deleteUser, signIn, signUp, updatePassword, updateUser } from "../api/user";

export const signInAsync = createAsyncThunk('user/signInAsync', async ({ email, passowrd }) => {
    try {
        const response = await signIn(undefined, email, passowrd)

        if (response.status === 200) {
            await SecureStore.setItemAsync('accessToken', response.data.Token)
            await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.userData))
            showToast('Welcome to rescue wheels')

            return response.data
        } else if (response.status === 201) {
            showToast(response.data.message)

            return {
                userData: null,
                accessToken: null
            }
        }
    } catch (err) {
        console.log(err.response.data);
        showToast(SMTH_WENT_WRONG)

        return {
            userData: null,
            accessToken: null
        }
    }
})

export const signOutAsync = createAsyncThunk('user/signOutAsync', async (navigation) => {
    navigation.popToTop()
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
    navigation
}) => {
    try {
        const response = await signUp(firstName, lastName, email, password, mobileNumber)

        if (response.status === 201) {
            showToast(response.data.message)
            navigation.popToTop()
        }
    } catch (err) {
        if (err.response.data.status === 409) {
            showToast(err.response.data.message)
        } else {
            showToast(SMTH_WENT_WRONG)
            console.log(err);
        }
    }
})

export const updateUserAsync = createAsyncThunk('user/updateUserAsync', async ({
    firstName,
    lastName,
    mobileNumber
}) => {
    try {
        const response = await updateUser(firstName, lastName, mobileNumber)

        if (response.status === 200) {
            await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.updatedUser))
            showToast(response.data.message)

            return {
                data: response.data.updatedUser,
                isValid: true
            }
        } else {
            return {
                isValid: false
            }
        }
    } catch (err) {
        console.log(err.response.data);
        showToast(SMTH_WENT_WRONG)

        return {
            isValid: false
        }
    }
})

export const deleteUserAsync = createAsyncThunk('user/deleteUserAsync', async () => {
    try {
        const response = await deleteUser()

        if (response.status === 200) {
            await SecureStore.deleteItemAsync('accessToken')
            await SecureStore.deleteItemAsync('currentUser')
            showToast(response.data.message)

            return true
        }
    } catch (err) {
        console.log(err.response.data);
        showToast(SMTH_WENT_WRONG)
    }
})

export const updatePasswordAsync = createAsyncThunk('user/updatePasswordAsync', async ({
    oldPassword,
    newPassword,
    confirmNewPassword
}) => {
    try {
        const response = await updatePassword(oldPassword, newPassword, confirmNewPassword)

        if (response.status === 200) {
            showToast(response.data.message)
        }

    } catch (err) {
        console.log(err.response.data);
        
        if (err.response.data.status === 409) {
            showToast(err.response.data.message)
        } else {
            showToast(SMTH_WENT_WRONG)
        }
    }
})

export const addVehicleAsync = createAsyncThunk('user/addVehicleAsync', async ({ make, model, licensePlate, type, energySource, onRequestClose }) => {
    try {
        const response = await addVehicle(make, model, licensePlate, type, energySource)

        if (response.status === 201) {
            showToast(response.data.message)
            onRequestClose()
            await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.user))

            return {
                isValid: true,
                data: response.data.user
            }
        }
    } catch (err) {
        console.log(err.response.data);
        showToast(SMTH_WENT_WRONG)

        return {
            isValid: false
        }
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
    }
})

export default userSlice.reducer