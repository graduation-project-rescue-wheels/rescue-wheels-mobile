import { io } from 'socket.io-client'

export const socket = io(process.env.EXPO_PUBLIC_API_URL, {
    autoConnect: false,
    auth: {
        token: null // intializing token with a null value to be able to modify it after successful sign in/user datat loading  
    }
})