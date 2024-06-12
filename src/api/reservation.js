import rwClient from "./axios";

export async function addReservation(repairCenterId, date, description, title) {
    const endDate = new Date(date)

    return await rwClient.post(`/Reservation/addReservation/${repairCenterId}`, {
        description,
        startDate: date,
        endDate,
        title
    })
}

export async function getUpcomingReservations(repairCenterId) {
    return await rwClient.get(`/Reservation/getUpcomingReservations/${repairCenterId}`)
}