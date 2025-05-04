<template>
  <div class="layout" :class="{ 'blurred': isModalOpen }">
    <NavigationBar class="navbar" />
    <div class="main-content">
      <ChatList class="chat-list" @selectChat="selectChat" ref="chatListRef" />
      <component
        :is="currentComponent"
        class="chat-box"
        v-bind="currentProps"
        @refreshChatList="refreshChatList"
        @updateIsSending="updateIsSending"
        key="currentKey"
      />
    </div>
  </div>

  <!-- PDFUploadForm 모달 -->
  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal-content">
      <PDFUploadForm @close="closeModal" @refreshChatList="refreshChatList" />
      <button class="close-button" @click="closeModal">X</button>
    </div>
  </div>
</template>

<script setup>
import { shallowRef, ref } from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'
import ChatList from '@/components/ChatList.vue'
import DCUChatBox from '@/components/DCUChatBox.vue'
import PDFChatBox from '@/components/PDFChatBox.vue'
import PDFUploadForm from '@/components/PDFUploadForm.vue'

// 컴포넌트 매핑
const components = {
  DCUChatBox,
  PDFChatBox,
}

const currentComponent = shallowRef(components.DCUChatBox) // 기본 컴포넌트는 DCUChatBox
const currentProps = shallowRef({}) // 동적 컴포넌트에 전달할 props
const currentKey = shallowRef(0) // 컴포넌트 강제 재렌더링을 위한 키
const isSending = ref(false) // 메시지 전송 상태

const chatListRef = shallowRef(null) // ChatList 컴포넌트 참조
const isModalOpen = ref(false) // PDFUploadForm 모달 상태

// ChatList 새로고침
const refreshChatList = () => {
  if (chatListRef.value) {
    chatListRef.value.loadChats() // ChatList 컴포넌트의 메서드 호출
  }
}

// 채팅 선택 시 컴포넌트 변경
const selectChat = (chatId) => {
  if (isSending.value) {
    alert('현재 메시지를 전송 중입니다. 완료 후 다른 채팅으로 이동할 수 있습니다.')
    return
  }
  if (chatId === 'dcu') {
    currentComponent.value = components.DCUChatBox
    currentProps.value = {}
  } else if (chatId === 'new-pdf') {
    openModal() // PDFUploadForm 모달 열기
  } else {
    currentComponent.value = components.PDFChatBox
    currentProps.value = { chatId }
    currentKey.value++ // 컴포넌트 강제 재렌더링
  }
}

// 모달 열기
const openModal = () => {
  isModalOpen.value = true
}

// 모달 닫기
const closeModal = () => {
  isModalOpen.value = false
}

// 자식 컴포넌트에서 isSending 상태 업데이트
const updateIsSending = (value) => {
  isSending.value = value
}
</script>

<style scoped>
/* 전체 레이아웃 */
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: filter 0.3s ease; /* 블러 효과 전환 */
}

.layout.blurred {
  filter: blur(5px); /* 블러 효과 */
  pointer-events: none; /* 클릭 불가 */
}

/* 네비게이션 바 */
.navbar {
  flex: 0 0 auto; /* 상단 고정 */
  width: 100%;
  border-bottom: 1px solid #ddd;
}

/* 메인 컨텐츠 영역 */
.main-content {
  display: flex;
  flex: 1; /* 남은 공간을 채움 */
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: stretch; /* 세로로 공간을 채움 */
}

/* 채팅 리스트 */
.chat-list {
  flex: 0 0 250px; /* 고정 너비 */
  background: #f9f9f9;
  border-right: 1px solid #ddd; /* 구분선 */
}

/* 채팅 박스 */
.chat-box {
  flex: 0 0 80%; /* 남은 공간의 80%를 차지 */
  display: flex;
  flex-direction: column;
  height: 90vh; /* 부모 높이 채움 */
  overflow: hidden; /* 내부 콘텐츠 넘침 방지 */
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 모달 콘텐츠 */
.modal-content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 600px;
  height: auto;
}

/* 닫기 버튼 */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #FFE200;
  color: black;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  cursor: pointer;
}
</style>