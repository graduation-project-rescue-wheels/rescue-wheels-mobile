import rwClient from "./axios";
import * as SecureStore from 'expo-secure-store'

export async function requestEmergency(vehicle, coordinates, type) {
    const { _id } = JSON.parse(await SecureStore.getItemAsync('currentUser'))

    return rwClient.put('/emrgencyRequest/addRequest', {
        vehicle,
        coordinates,
        type,
        requestedBy: _id
    })
}

export async function getRequestById(id) {
    return rwClient.get(`/emrgencyRequest/getRequestById/${id}`)
}

export async function cancelResponder(id) {
    return rwClient.put(`/emrgencyRequest/cancelResponder/`, { id })
}

export async function cancelRequest(id) {
    return rwClient.put('/emrgencyRequest/cancelRequest', { id })
}

export async function getNearbyRequests(long, lat) {
    return rwClient.get(`/emrgencyRequest/nearbyRequests/${long}/${lat}`)
}

export async function acceptRequest(id) {
    return rwClient.put('/emrgencyRequest/acceptRequest', { id })
}