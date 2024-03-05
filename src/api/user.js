import rwClient from "./axios";

export async function signIn(username, email, password) {
    return await rwClient.post('/user/signIn', {
        username,
        email,
        password
    })
}

export async function signUp(firstName, lastName, email, password, mobileNumber, DOB) {
    return await rwClient.post('/user/signUp', {
        firstName,
        lastName,
        email,
        password,
        mobileNumber
    })
}