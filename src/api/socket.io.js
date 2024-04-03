import { io } from 'socket.io-client'
import { accessToken } from '../jwt/token';

export const socket = io(process.env.EXPO_PUBLIC_API_URL, {
    autoConnect: false,
    auth: {
        token: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
    }
})