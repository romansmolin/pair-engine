import axios from 'axios'

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
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
        if (error.response?.status === 401) {
            const code = error.response?.data?.error?.code
            const shouldRedirectToSignIn =
                typeof window !== 'undefined' &&
                code === 'AUTH_REQUIRED' &&
                !window.location.pathname.startsWith('/auth/sign-in')

            if (shouldRedirectToSignIn) {
                const next = `${window.location.pathname}${window.location.search}`
                const encodedNext = encodeURIComponent(next)
                window.location.assign(`/auth/sign-in?reason=session-expired&next=${encodedNext}`)
            }
        }
        return Promise.reject(error)
    },
)
