import rwClient from "./axios";

export async function getAllRepairCenters() {
    return await rwClient.get('/RepairCenter/GetAllRepairCenters')
}