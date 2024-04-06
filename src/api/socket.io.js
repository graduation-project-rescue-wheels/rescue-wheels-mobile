import { io } from 'socket.io-client'
import { store } from '../store/store';

export const socket = io(process.env.EXPO_PUBLIC_API_URL, {
    autoConnect: false,
    auth: {
        token: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + store.getState().user.accessToken
    }
})