//This is a function which calculates the distance in kilometers between two points. Used formula Haversine formula 
export const calculateDistance = (long1, lat1, long2, lat2) => {
    return Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(long2 - long1)) * 6371 //6371 is Earth radius in kilometers
}