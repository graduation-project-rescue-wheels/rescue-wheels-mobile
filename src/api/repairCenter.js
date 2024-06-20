import rwClient from "./axios";

export async function getAllRepairCenters(filters, sortedBy, isAscending, coords) {
    return await rwClient.get(`/RepairCenter/GetAllRepairCenters/${JSON.stringify(filters)}/${sortedBy}/${isAscending}/${JSON.stringify(coords)}`)
}

export async function getRepairCenterById(id) {
    return await rwClient.get(`/RepairCenter//GetSingleRepairCenter/${id}`)
}