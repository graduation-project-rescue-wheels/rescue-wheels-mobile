import rwClient from "./axios";
import * as SecureStore from 'expo-secure-store'

export async function signIn(username, email, password) {
    return await rwClient.post('/user/signIn', {
        username,
        email,
        password
    })
}

export async function signUp(firstName, lastName, email, password, mobileNumber) {
    return await rwClient.post('/user/signUp', {
        firstName,
        lastName,
        email,
        password,
        mobileNumber
    })
}

export async function updateUser(firstName, lastName, mobileNumber) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.put('/user/UpdateUserData', {
        firstName,
        lastName,
        mobileNumber,
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function deleteUser() {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.delete('/user/DeleteUser', {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function updatePassword(oldPassword, newPassword, confirmNewPassword) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.put('/user/UpdatePassword', {
        oldPassword,
        newPassword,
        confirmNewPassword
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function getCurrnetUser() {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.get('/user/getUserData', {
        headers: {
            accessToken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}