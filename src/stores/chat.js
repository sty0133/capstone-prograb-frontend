import { defineStore } from 'pinia'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [],
    STORAGE_KEY: 'dcu_chat_messages',
  }),
  actions: {
    // 로컬 스토리지에서 메시지 불러오기
    loadMessages() {
      const storedData = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}')
      const now = Date.now()

      if (storedData.expiry && storedData.expiry > now) {
        this.messages = storedData.data || []
      } else {
        this.clearMessages() // 만료된 데이터 삭제
      }
    },
    // 로컬 스토리지에 메시지 저장
    saveMessages() {
      const messagesWithExpiry = {
        data: this.messages,
        expiry: this.getNextMidnightTimestamp(), // 다음 자정 시간으로 만료 설정
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messagesWithExpiry))
    },
    // 메시지 추가
    addMessage(message) {
      this.messages.push(message)
      this.saveMessages()
    },
    // 메시지 초기화
    clearMessages() {
      this.messages = []
      localStorage.removeItem(this.STORAGE_KEY)
    },
    // 로컬 스토리지 초기화 (저장된 메시지가 없을 경우)
    initializeMessages() {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        // console.log('No messages found in local storage.')
        this.clearMessages()
      }
    },
    // 다음 자정(24시) 타임스탬프 계산
    getNextMidnightTimestamp() {
      const now = new Date()
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      return nextMidnight.getTime()
    },
  },
})