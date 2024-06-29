import rwClient from "./axios";

export async function getAllOffers() {
    return await rwClient.get('/Offer/getAllOffer')
}