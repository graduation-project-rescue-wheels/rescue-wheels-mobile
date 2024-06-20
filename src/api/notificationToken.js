import rwClient from "./axios";

export async function addNotificationToken(token) {
    return await rwClient.post('/notificationToken/addNotificationToken', { token })
}