import messaging from '@react-native-firebase/messaging'
import * as Notifications from 'expo-notifications'
import { addNotificationToken } from '../api/notificationToken'

export const registerForNotifications = async () => {
    try {
        const res = await messaging().requestPermission()

        if (res === messaging.AuthorizationStatus.AUTHORIZED || res === messaging.AuthorizationStatus.PROVISIONAL) {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX
            })

            const token = await messaging().getToken()

            if (token) {
                await addNotificationToken(token)
            }
        }
    } catch (err) {
        console.log(err);
    } finally {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log("remoteMessage:", remoteMessage);
        })
    }
}