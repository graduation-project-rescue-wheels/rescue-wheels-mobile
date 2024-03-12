import showToast, { SMTH_WENT_WRONG } from "../components/Toast";
import * as SecureStore from 'expo-secure-store'
import { deleteUser, getCurrnetUser, signIn, signUp, updatePassword, updateUser } from "../api/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addVehicle, deleteVehicle } from "../api/vehicle";
import * as SplashScreen from 'expo-splash-screen'

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
    navigation.navigate('Home')
    await SecureStore.deleteItemAsync('accessToken')
    await SecureStore.deleteItemAsync('currentUser')
})

export const loadUserAsync = createAsyncThunk('user/loadUserAsync', async () => {
    try {
        const response = await getCurrnetUser()

        if (response.status === 200) {
            await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.data))

            return {
                userData: response.data.data,
                accessToken: await SecureStore.getItemAsync('accessToken')
            }
        }
    } catch (err) {
        console.log(err);

        //In case of failed call, load locally stored user data
        return {
            userData: JSON.parse(await SecureStore.getItemAsync('currentUser')),
            accessToken: await SecureStore.getItemAsync('accessToken')
        }
    } finally {
        await SplashScreen.hideAsync()
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
    confirmNewPassword,
    setModalVisible
}) => {
    try {
        const response = await updatePassword(oldPassword, newPassword, confirmNewPassword)

        if (response.status === 200) {
            showToast(response.data.message)
            setModalVisible(false)
        }

    } catch (err) {
        console.log(err);

        if (err.response.status === 404) {
            showToast(err.response.data.errMsg)
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

export const deleteVehicleAsync = createAsyncThunk('user/deleteVehicleAsync', async ({ id, onRequestClose }) => {
    try {
        const response = await deleteVehicle(id)

        if (response.status === 200) {
            await SecureStore.setItemAsync('currentUser', JSON.stringify(response.data.user))
            onRequestClose()
            showToast(response.data.message)

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
