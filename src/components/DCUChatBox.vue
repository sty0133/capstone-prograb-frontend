<!-- src/components/ChatBox.vue -->
<template>
  <div class="chatbox">
    <div class="messages" ref="messagesContainer">
      <div v-if="chatStore.messages.length === 0" class="placeholder">
        무엇을 도와드릴까요?
      </div>
      <div
        v-for="(message, index) in chatStore.messages"
        :key="index"
        :class="['message', message.type]"
        v-html="message.text"
      >
      </div>
    </div>
    <div class="input-area">
      <input
        type="text"
        v-model="newMessage"
        placeholder="DCU BOT에게 물어보세요"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">➤</button>
    </div>
    <p class="warning-message">DCU BOT은 실수를 할 수 있습니다. 중요한 정보는 재차 확인하세요.</p>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import axios from 'axios'
import { useChatStore } from '@/stores/chat'

const emit = defineEmits(['updateIsSending'])

const chatStore = useChatStore()
const newMessage = ref('')
const messagesContainer = ref(null)
const isSending = ref(false) // 메시지 전송 중인지 확인하는 플래그

// 줄바꿈 변환 함수
const formatMessage = (text) => {
  return text.replace(/\n/g, '<br>') // 연속된 \n을 <br>로 변환
}

const sendMessage = async () => {
  if (newMessage.value.trim() === '' || isSending.value) return

  const userInput = newMessage.value
  newMessage.value = ''
  isSending.value = true
  emit('updateIsSending', true)

  // 사용자 메시지 추가
  const userMessage = { text: userInput, type: 'user' }
  chatStore.addMessage(userMessage) // 스토어에 저장
  scrollToBottom()

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/dcu/rag`, {
      question: userInput,
    })

    if (response.data.status === 'success') {
      // 봇 응답 메시지 추가
      const botMessage = { text: formatMessage(response.data.data.response), type: 'bot' }
      chatStore.addMessage(botMessage) // 스토어에 저장
    } else {
      console.error('에러 발생:', response.data.message)
    }
  } catch (error) {
    console.error('요청 중 오류 발생:', error)
  }

  isSending.value = false
  scrollToBottom()
  emit('updateIsSending', false)
}

// 스크롤을 맨 아래로 이동
const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 컴포넌트가 마운트될 때 로컬 스토리지에서 메시지 불러오기
onMounted(() => {
  chatStore.initializeMessages() // 로컬 스토리지 초기화
  chatStore.loadMessages() // 스토어에서 메시지 불러오기
  scrollToBottom()
})
</script>

<style scoped>
.chatbox {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px; /* ChatBox의 최대 너비 고정 */
  margin: 0 auto; /* 중앙 정렬 */
}

.messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  min-height: 0;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.messages::-webkit-scrollbar {
  display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
}

.placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(0, 0, 0, 0.272); /* 반투명 상태 */
  font-size: 2rem;
  text-align: center;
  user-select: none; /* 텍스트 드래그 방지 */
}

.message {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  overflow-y: auto;
  width: fit-content;
  word-wrap: break-word; /* 긴 단어를 줄바꿈 */
  animation: slide-up 0.3s ease-out; /* 애니메이션 추가 */
}

.message.user {
  align-self: flex-end;
  background: #dceeff;
  margin-left: auto;
  max-width: 40%;
}

.message.bot {
  align-self: flex-start; /* 왼쪽 정렬 */
  background: #e3e3e3;
  margin-right: auto; /* 오른쪽 여백 자동 */
  max-width: 60%;
}

.input-area {
  display: flex;
  padding: 0.8rem;
  justify-content: center;
  align-items: center;
}

input {
  flex: 1;
  border: none;
  padding: 0.5rem;
  padding-left: 1.5rem; /* 텍스트 입력 시작 위치를 radius 끝나는 부분으로 설정 */
  padding-right: 1.5rem; /* 텍스트 입력 끝 위치를 radius 끝나는 부분으로 설정 */
  border-radius: 60px;
  background: #f0f0f0;
  margin-right: 0.5rem;
  font-size: 1rem;
  max-width: 70%;
  flex-shrink: 0;
}

button {
  background: none;
  border: none;
  font-size: 1rem;
}

.warning-message {
  color: #69696978;
  font-size: 0.8rem;
  margin-top: 0rem;
  text-align: center;
  user-select: none;
  margin-bottom: 1vh; /* 바닥에서 조금 올리기 위해 여백 추가 */
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>