<!-- src/components/RegisterForm.vue -->
<template>
  <div class="register-form">
    <h2>회원가입</h2>
    <input 
      v-model="user_id" 
      type="text" 
      placeholder="아이디" 
      @keyup.enter="handleRegister" 
    />
    <input 
      v-model="user_password" 
      type="password" 
      placeholder="비밀번호 (6자 이상)" 
      @keyup.enter="handleRegister" 
    />
    <input 
      v-model="user_password_confirm" 
      type="password" 
      placeholder="비밀번호 확인" 
      @keyup.enter="handleRegister" 
    />
    <input 
      v-model="user_name" 
      type="text" 
      placeholder="이름" 
      @keyup.enter="handleRegister" 
    />
    <input 
      v-model="user_school_uqid" 
      type="text" 
      placeholder="학번 (숫자 8자)" 
      @keyup.enter="handleRegister" 
    />
    <button @click="handleRegister">회원가입</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RegisterForm',
  data() {
    return {
      user_id: '',
      user_password: '',
      user_password_confirm: '',
      user_name: '',
      user_school_uqid: ''
    }
  },
  methods: {
    async handleRegister() {
      // 비어있는 필드 확인
      if (!this.user_id) {
        alert('아이디를 입력해주세요.')
        return
      }
      if (!this.user_password) {
        alert('비밀번호를 입력해주세요.')
        return
      }
      if (!this.user_password_confirm) {
        alert('비밀번호 확인을 입력해주세요.')
        return
      }
      if (!this.user_name) {
        alert('이름을 입력해주세요.')
        return
      }
      if (!this.user_school_uqid) {
        alert('학번을 입력해주세요.')
        return
      }

      // 입력값 유효성 검사
      if (!/^[a-zA-Z0-9]+$/.test(this.user_id)) {
        alert('아이디는 영어 또는 숫자만 입력 가능합니다.')
        return
      }
      if (this.user_password.length < 6) {
        alert('비밀번호는 6자 이상이어야 합니다.')
        return
      }
      if (this.user_password !== this.user_password_confirm) {
        alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
        this.user_password = '' // 비밀번호 초기화
        this.user_password_confirm = '' // 비밀번호 확인 초기화
        return
      }
      if (!/^\d{8}$/.test(this.user_school_uqid)) {
        alert('학번은 숫자 8자여야 합니다.')
        return
      }

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/register`, {
          user_id: this.user_id,
          user_password: this.user_password,
          user_name: this.user_name,
          user_school_uqid: parseInt(this.user_school_uqid)
        })

        if (res.data.status === 'success') {
          alert(`회원가입 성공! \n${res.data.data}님 환영합니다!`)
          this.$router.push('/login') // 회원가입 성공 후 로그인 페이지로 이동
        }
      } catch (error) {
        if (error.response) {
          const status = error.response.status
          const errorData = error.response.data

          if (status === 409) {
            if (errorData.error === 'member_already_registered_id') {
              alert('이미 등록된 아이디입니다.')
              this.user_id = ''
            } else if (errorData.error === 'member_already_registered_school_uqid') {
              alert('이미 등록된 학번입니다.')
              this.user_school_uqid = ''
            }
          } else if (status === 500) {
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          } else {
            alert(errorData.message || '알 수 없는 오류가 발생했습니다.')
          }
        } else {
          alert('서버와의 연결에 문제가 발생했습니다.')
        }
      }
    }
  }
}
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 300px;
  margin: auto;
}
.register-form h2 {
  text-align: center;
  margin-bottom: 20px;
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
</style>