import axios from "axios"

const rwClient = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
})

export default rwClient