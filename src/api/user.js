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

export async function updateUser(data) {
    return await rwClient.put('/user/UpdateUserData', data,
        { headers: { 'Content-Type': 'multipart/form-data', } })
}

export async function deleteUser() {
    return await rwClient.delete('/user/DeleteUser')
}

export async function updatePassword(oldPassword, newPassword, confirmNewPassword) {
    return await rwClient.put('/user/UpdatePassword', {
        oldPassword,
        newPassword,
        confirmNewPassword
    })
}

export async function getCurrnetUser() {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.get('/user/getUserData', {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function forgotPassowrd(email) {
    return await rwClient.post('/user/forgetPassword', { email })
}

export async function verifyOtp(otp, email) {
    return await rwClient.post('/user/otpverification', { email, otp })
}

export async function changePassword(email, password, ConfirmNewPassword) {
    return await rwClient.post('/user/ResetPassword', { email, password, ConfirmNewPassword })
}
