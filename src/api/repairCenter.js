import rwClient from "./axios";

export async function getAllRepairCenters() {
    return await rwClient.get('/RepairCenter/GetAllRepairCenters')
}

export async function getRepairCenterById(id) {
    return await rwClient.get(`/RepairCenter//GetSingleRepairCenter/${id}`)
}