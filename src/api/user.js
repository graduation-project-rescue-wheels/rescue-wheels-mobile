import rwClient from "./axios";

export async function signIn(username, email, password) {
    return await rwClient.post('/user/signIn', {
        username,
        email,
        password
    })
}