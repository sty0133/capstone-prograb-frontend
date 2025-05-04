import axios from 'axios'
import { useUserStore } from '@/stores/user'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정 (10초)
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    const token = userStore.authToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}` // Authorization 헤더에 토큰 추가
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const userStore = useUserStore()

    if (error.response && error.response.data) {
      userStore.handleTokenError(error) // 토큰 관련 에러 처리
    }

    return Promise.reject(error)
  }
)

export default apiClient