import { accessToken } from "../jwt/token";
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
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function cancelResponder(id) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return rwClient.put(`/emrgencyRequest/cancelResponder/`, {
        id
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function cancelRequest(id) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return rwClient.put('/emrgencyRequest/cancelRequest', {
        id
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function getNearbyRequests(long, lat) {
    return rwClient.get(`/emrgencyRequest/nearbyRequests/${long}/${lat}`, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}
export async function acceptRequest(id) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return rwClient.put('/emrgencyRequest/acceptRequest', {
        id
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}