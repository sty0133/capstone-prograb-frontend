<template>
  <div class="chat-list">
    <button class="dcu-bot" @click="selectChat('dcu')">DCU CHAT BOT</button>
    <button class="new-chat" @click="handleNewPdfBotClick">NEW PDF BOT</button>

    <ul>
      <li v-for="chat in chats" :key="chat.id">
        <button
          class="chat-item"
          :class="{ 'selected': selectedChatId === chat.title }"
          @click="selectChat(chat.title)"
        >
          {{ chat.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/plugins/axios'
import { useUserStore } from '@/stores/user'

const emit = defineEmits(['selectChat'])

const chats = ref([])
const userStore = useUserStore()
const errorMessage = ref('')
const selectedChatId = ref('') // 현재 선택된 채팅 ID

// 채팅 선택 이벤트
const selectChat = (chatId) => {
  selectedChatId.value = chatId // 선택된 채팅 ID 업데이트
  emit('selectChat', chatId)
}

// NEW PDF BOT 버튼 클릭 핸들러
const handleNewPdfBotClick = () => {
  if (!userStore.isLoggedIn) {
    alert('회원 전용 기능입니다. 로그인 후 이용해주세요.')
    return
  }
  selectChat('new-pdf') // 로그인 상태일 경우에만 이벤트 전달
}

// 채팅 목록 로드
const loadChats = async () => {
  chats.value = [] // 초기화
  if (!userStore.isLoggedIn) {
    console.warn('사용자가 로그인하지 않았습니다.')
    return
  }
  try {
    const response = await apiClient.get('/user/list') // 서버로 요청 보내기

    if (response.data.status === 'success') {
      // 채팅 목록이 비어 있는 경우
      if (response.data.data.chat_list.length === 0) {
        errorMessage.value = '채팅 목록이 비어 있습니다.'
        chats.value = [] // 빈 배열로 설정
      } else {
        // 채팅 목록 조회 성공
        chats.value = response.data.data.chat_list.map((chat, index) => ({
          id: index + 1,
          title: chat,
        }))
      }
    } else {
      console.error('알 수 없는 성공 상태:', response.data.message)
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response

      if (status === 404 && data.error === 'user_not_found') {
        errorMessage.value = '사용자 데이터에 문제가 생겼습니다. 관리자에게 문의해 주세요.'
        userStore.clearToken() // 토큰 초기화
        alert(errorMessage.value)
      } else if (status === 500 && data.error === 'internal_server_error') {
        errorMessage.value = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      } else {
        errorMessage.value = data.message || '알 수 없는 오류가 발생했습니다.'
      }
    } else {
      errorMessage.value = '서버와의 연결에 문제가 발생했습니다.'
    }

    console.error('채팅 목록을 가져오는 중 오류 발생:', errorMessage.value)
  }
}

// 컴포넌트가 마운트될 때 채팅 목록 로드
onMounted(() => {
  loadChats()
})

// 외부에서 loadChats 메서드와 응답 대기 상태를 노출
defineExpose({
  loadChats,
})
</script>

<style scoped>
.chat-list {
  background: #f9f9f9;
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  display: flex; /* Flexbox 활성화 */
  flex-direction: column; /* 버튼들을 세로로 정렬 */
  align-items: center; /* 수평 중앙 정렬 */
  justify-content: flex-start; /* 수직 정렬 (위쪽부터 시작) */
}

.dcu-bot {
  background: #FFE200;
  border: none;
  font-weight: bold;
  padding: 0.5rem;
  width: 80%; /* 버튼 너비를 줄여 중앙 정렬 효과 강화 */
  margin-bottom: 0.4rem;
  border-radius: 5px;
  text-align: center; /* 텍스트 중앙 정렬 */
}

.dcu-bot:hover {
  background: #d3d3d3; /* 호버 시 회색 배경 */
}

.new-chat {
  background: #FFE200;
  border: none;
  font-weight: bold;
  padding: 0.5rem;
  width: 80%; /* 버튼 너비를 줄여 중앙 정렬 효과 강화 */
  margin-bottom: 1rem;
  border-radius: 5px;
  text-align: center; /* 텍스트 중앙 정렬 */
}

.new-chat:hover {
  background: #d3d3d3; /* 호버 시 회색 배경 */
}

ul {
  list-style: none; /* 불릿 포인트 제거 */
  padding: 0; /* 기본 패딩 제거 */
  margin: 0; /* 기본 마진 제거 */
  width: 100%; /* 리스트 너비를 100%로 설정 */
  display: flex; /* Flexbox 활성화 */
  flex-direction: column; /* 리스트 아이템을 세로로 정렬 */
  align-items: center; /* 리스트 아이템을 수평 중앙 정렬 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
  -ms-overflow-style: none; /* IE에서 스크롤바 숨기기 */
  position: relative;
}

.ul::-webkit-scrollbar {
  display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
}

li {
  width: 100%; /* li 요소의 너비를 100%로 설정 */
  display: flex; /* Flexbox 활성화 */
  justify-content: center; /* li 내부에서 자식 요소를 중앙 정렬 */
}

.chat-item {
  background: #d3d3d3; /* 회색 배경 */
  border: none;
  font-weight: bold;
  padding: 0.5rem;
  width: 80%; /* 버튼 너비를 줄여 중앙 정렬 효과 강화 */
  margin-bottom: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  text-align: center; /* 텍스트 중앙 정렬 */
}

.chat-item:hover {
  background: #bfbfbf; /* 호버 시 더 어두운 회색 */
}

.chat-item.selected {
  background: rgb(46, 46, 46); /* 선택된 채팅의 배경색 */
  color: white; /* 선택된 채팅의 글자색 */
}
</style>