import rwClient from "./axios";

export async function addReservation(repairCenterId, date, description, title) {
    const endDate = new Date(date)
    endDate.setHours(endDate.getHours() + 1)

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

export async function getUpcomingReservationsForCurrentUser() {
    return await rwClient.get('/Reservation/getUpcomingReservationsForUser')
}

export async function cancelReservation(reservationId) {
    return await rwClient.get(`/Reservation/cancelReservation/${reservationId}`)
}

export async function getRecentReservationHistory() {
    return await rwClient.get('/Reservation/getRecentReservationsHistory')
}

export async function getUserReservationHistory() {
    return await rwClient.get('/Reservation/getUserReservationHistory')
}