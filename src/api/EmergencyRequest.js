import rwClient from "./axios";
import * as SecureStore from 'expo-secure-store'

export async function requestEmergency(vehicle, coordinates, type) {
    const accessToken = await SecureStore.getItemAsync('accessToken')
    const { _id } = JSON.parse(await SecureStore.getItemAsync('currentUser'))

    return rwClient.put('/emrgencyRequest/addRequest', {
        vehicle,
        coordinates,
        type,
        requestedBy: _id
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function getRequestById(id) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return rwClient.get(`/emrgencyRequest/getRequestById/${id}`, {
        headers: {
            accessToken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}