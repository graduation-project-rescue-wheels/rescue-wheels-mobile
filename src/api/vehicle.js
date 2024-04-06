import rwClient from "./axios";
import * as SecureStore from "expo-secure-store"

export async function addVehicle(make, model, licensePlate, modelYear, type, energySource) {
    const owner = JSON.parse(await SecureStore.getItemAsync('currentUser'))._id

    return await rwClient.post('/vehicle/addVehicle', {
        make,
        model,
        licensePlate,
        type,
        energySource,
        modelYear,
        owner
    })
}

export async function getVehicleById(id) {
    return await rwClient.get(`/vehicle/getVehicleById/${id}`)
}

export async function deleteVehicle(id) {
    return await rwClient.delete(`/vehicle/deleteVehicle/${id}`)
}