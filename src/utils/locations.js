import axios from "axios"

//This is a function which calculates the distance in kilometers between two points. Used formula Haversine formula 
export const calculateDistance = (long1, lat1, long2, lat2) => {
    const earthR = 6371 // 6371 is radius of Earth
    const lat1Rad = lat1 * Math.PI / 180
    const lat2Rad = lat2 * Math.PI / 180
    const deltaLatRad = (lat2 - lat1) * Math.PI / 180
    const deltaLongRad = (long2 - long1) * Math.PI / 180

    const a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(deltaLongRad / 2) * Math.sin(deltaLongRad / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return earthR * c
}

export const getAddress = async (coordinate) => {
    return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`)
}