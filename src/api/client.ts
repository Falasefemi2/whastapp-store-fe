import axios from "axios"

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/",
    withCredentials: true, // critical — sends httpOnly cookie with every request
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"]
    }
    return config
})

export default apiClient
