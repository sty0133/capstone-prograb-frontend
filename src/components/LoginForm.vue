<template>
  <div class="login-form">
    <h2>로그인</h2>
    <input 
      v-model="user_id" 
      type="text" 
      placeholder="아이디" 
      @keyup.enter="handleLogin" 
    />
    <input 
      v-model="user_password" 
      type="password" 
      placeholder="비밀번호" 
      @keyup.enter="handleLogin" 
    />
    <button @click="handleLogin">로그인</button>
    <button class="register-button" @click="goToRegister">회원가입</button>

    <div class="guest-option">
      <a href="/">비회원으로 시작하기</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'

export default {
  name: 'LoginForm',
  data() {
    return {
      user_id: '',
      user_password: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ''
      this.successMessage = ''

      // user_id 유효성 검사
      const userIdRegex = /^[a-zA-Z0-9]+$/ // 영어와 숫자만 허용
      if (!userIdRegex.test(this.user_id)) {
        alert('아이디는 영어 또는 숫자만 입력 가능합니다.')
        this.resetInputs()
        return
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
          user_id: this.user_id,
          user_password: this.user_password
        })

        if (res.data.status === 'success') {
          this.successMessage = res.data.message
          const userStore = useUserStore()
          userStore.setToken(res.data.token)
          this.$router.push('/')
          return
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status
          if (status === 404) {
            this.errorMessage = '아이디 또는 비밀번호가 잘못되었습니다.'
          } else if (status === 401) {
            this.errorMessage = '서버 오류가 발생했습니다.'
          } else if (status === 500) {
            this.errorMessage = '서버 오류가 발생했습니다.'
          } else {
            this.errorMessage = error.response.data.message || '알 수 없는 오류가 발생했습니다.'
          }
        } else {
          this.errorMessage = '서버와의 연결에 문제가 발생했습니다.'
        }
        alert(`${this.errorMessage}`) // 실패 시 alert 표시
        this.resetInputs() // 에러 발생 시 입력란 초기화
      }
    },
    resetInputs() {
      this.user_id = ''
      this.user_password = ''
    },
    goToRegister() {
      this.$router.push('/register') // 회원가입 페이지로 이동
    }
  }
}
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 300px;
  margin: auto;
}
.login-form h2 {
  text-align: center;
  margin-bottom: 40px;
}
input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
button {
  padding: 10px;
  background: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: gray;
}
.guest-option {
  margin-top: 20px;
  text-align: center; /* 중앙 정렬 */
}
.guest-option a {
  text-decoration: none;
  color: gray;
  cursor: pointer;
  font-size: small;
}
.guest-option a:hover {
  color: black;
}
</style>