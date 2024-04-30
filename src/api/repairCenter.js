import rwClient from "./axios";

export async function getAllRepairCenters() {
    return rwClient.get('/RepairCenter/GetAllRepairCenters')
}