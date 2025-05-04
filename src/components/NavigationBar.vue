<template>
  <div class="navbar">
    <div class="logo">
      <img src="@/assets/dcu-bot.png" alt="DCU Bot" />
    </div>
    <div class="button-group">
      <button class="feedback-button" @click="openFeedbackForm">피드백</button>
      <button class="auth-button" @click="toggleAuth">
        {{ isLoggedIn ? '로그아웃' : '로그인' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isLoggedIn = computed(() => userStore.isLoggedIn)

const toggleAuth = () => {
  if (isLoggedIn.value) {
    userStore.clearToken()
    alert('로그아웃 되었습니다.')
    window.location.reload()
  } else {
    router.push('/login')
  }
}

const openFeedbackForm = () => {
  const feedbackUrl = import.meta.env.VITE_FEEDBACK_URL // 환경변수에서 피드백 URL 가져오기
  window.open(feedbackUrl, '_blank')
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f9f9f9; /* 배경색 흰색 */
  border: none; /* 보더 제거 */
}

.logo img {
  margin-left: 2.5rem;
  width: 100px;
}

.button-group {
  display: flex;
  gap: 1rem; /* 버튼 간격 추가 */
  margin-right: 5%;
}

.feedback-button,
.auth-button {
  background-color: #FFE200; /* 버튼 배경색 노란색 */
  color: black; /* 버튼 텍스트 색 검은색 */
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none; /* 버튼 보더 제거 */
  cursor: pointer;
}

.feedback-button:hover,
.auth-button:hover {
  background-color: #d3d3d3; /* 호버 시 배경색 회색 */
}
</style>