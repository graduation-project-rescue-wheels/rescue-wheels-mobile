import rwClient from "./axios";

export async function addNotificationToken(token) {
    return await rwClient.post('/notificationToken/addNotificationToken', { token })
}

export async function deleteNotificationToken(token) {
    return await rwClient.delete(`/notificationToken/deleteNotificationToken/${token}`)
}