import rwClient from "./axios";
import * as SecureStore from "expo-secure-store"

export async function addVehicle(make, model, licensePlate, type, energySource) {
    const accessToken = await SecureStore.getItemAsync('accessToken')
    const owner = JSON.parse(await SecureStore.getItemAsync('currentUser'))._id

    return await rwClient.post('/user/addVehicle', {
        make,
        model,
        licensePlate,
        type,
        energySource,
        owner
    }, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function getVehicleById(id) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.get(`/vehicle/getVehicleById/${id}`, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}

export async function deleteVehicle(id) {
    const accessToken = await SecureStore.getItemAsync('accessToken')

    return await rwClient.delete(`/vehicle/deleteVehicle/${id}`, {
        headers: {
            accesstoken: process.env.EXPO_PUBLIC_ACCESS_TOKEN_PREFIX + accessToken
        }
    })
}