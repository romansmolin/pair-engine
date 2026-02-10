import axios from 'axios'

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

apiClient.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Handle 401 errors globally if needed
        if (error.response?.status === 401) {
            // Could redirect to login or dispatch an action
            console.warn('[API] Unauthorized request')
        }
        return Promise.reject(error)
    },
)
