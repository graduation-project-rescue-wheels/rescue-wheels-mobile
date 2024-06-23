import messaging from '@react-native-firebase/messaging'
import * as Notifications from 'expo-notifications'
import { addNotificationToken } from '../api/notificationToken'
import * as SecureStore from 'expo-secure-store'

export const registerForNotifications = async () => {
    try {
        const res = await messaging().requestPermission()

        if (res === messaging.AuthorizationStatus.AUTHORIZED || res === messaging.AuthorizationStatus.PROVISIONAL) {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX
            })

            const token = await messaging().getToken()
            const isNotificationTokenRegistered = await SecureStore.getItemAsync('notificationTokenRegistered')

            if (token && !isNotificationTokenRegistered) {
                await addNotificationToken(token)
                await SecureStore.setItemAsync('notificationTokenRegistered', true)
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