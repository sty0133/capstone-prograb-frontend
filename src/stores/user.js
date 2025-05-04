import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    authToken: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.authToken,
  },
  actions: {
    setToken(token) {
      this.authToken = token
      localStorage.setItem('authToken', token)
    },
    clearToken() {
      this.authToken = null
      localStorage.removeItem('authToken')
    },
    initializeToken() {
      const token = localStorage.getItem('authToken')
      if (token) {
        this.setToken(token)
      }
    },
    handleTokenError(error) {
      // 백엔드에서 반환된 토큰 관련 에러 처리
      if (error.response && error.response.data) {
        const { error: errorCode, message } = error.response.data

        if (errorCode === 'token_missing') {
          this.clearToken()
          // alert('토큰이 필요합니다. 다시 로그인해주세요.')
        } else if (errorCode === 'token_expired') {
          this.clearToken()
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
          this.$router.push('/login')
        } else if (errorCode === 'invalid_token') {
          this.clearToken()
          alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.')
          this.$router.push('/login')
        } else {
          console.error('오류:', message)
        }
      } else {
        console.error('토큰 처리 중 알 수 없는 오류 발생:', error)
      }
    },
  },
})